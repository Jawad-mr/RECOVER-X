import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Filter, Plus, Sparkles, MapPin, Clock, 
  ShieldCheck, GitMerge, Compass, Tag, Layers, RefreshCw,
  QrCode, Lock, CheckCircle2, ChevronRight, Bell, HelpCircle
} from "lucide-react";

import Navbar from "./components/Navbar";
import ItemCard from "./components/ItemCard";
import MatchHub from "./components/MatchHub";
import ReportModal from "./components/ReportModal";
import ItemDetailsModal from "./components/ItemDetailsModal";
import ClaimVerificationModal from "./components/ClaimVerificationModal";
import SafeHandoffModal from "./components/SafeHandoffModal";
import ApiKeyModal from "./components/ApiKeyModal";
import JudgeTourModal from "./components/JudgeTourModal";
import AnalyticsView from "./components/AnalyticsView";

import { INITIAL_REPORTS, CATEGORIES, CAMPUS_LOCATIONS } from "./data/seedData";
import { runMultimodalMatch } from "./services/geminiService";

export default function App() {
  // State
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem("campus_find_reports");
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "matches" | "vault" | "analytics"
  const [selectedType, setSelectedType] = useState("all"); // "all" | "lost" | "found"
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const [apiKey, setApiKey] = useState(() => localStorage.getItem("campus_find_gemini_key") || "");
  
  // Modals state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [detailsModalItem, setDetailsModalItem] = useState(null);
  const [claimModalItem, setClaimModalItem] = useState(null);
  const [handoffModalItem, setHandoffModalItem] = useState(null);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [judgeTourModalOpen, setJudgeTourModalOpen] = useState(false);

  // Match Hub focused pair
  const [selectedPair, setSelectedPair] = useState(null);

  // Proactive Push Notifications
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "High-Confidence AI Match Detected!",
      message: "Lost MacBook Pro (REP-9001) matched with Found Laptop (REP-9002) at 96% confidence.",
      score: 96,
      timeAgo: "10m ago",
      read: false,
      pair: {
        lost: INITIAL_REPORTS[0],
        found: INITIAL_REPORTS[1]
      }
    },
    {
      id: "notif-2",
      title: "Proactive Radar: Hydro Flask Match",
      message: "Teal Hydro Flask (REP-9003) matched with Gym Bleachers report (REP-9004) at 94%.",
      score: 94,
      timeAgo: "25m ago",
      read: false,
      pair: {
        lost: INITIAL_REPORTS[2],
        found: INITIAL_REPORTS[3]
      }
    }
  ]);

  // Persist reports
  useEffect(() => {
    localStorage.setItem("campus_find_reports", JSON.stringify(reports));
  }, [reports]);

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("campus_find_gemini_key", key);
  };

  // Filtered reports for Campus Explorer
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Type filter
      if (selectedType !== "all" && item.type !== selectedType) return false;
      // Category filter
      if (selectedCategory !== "All Categories" && item.category !== selectedCategory) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.title} ${item.description} ${item.location} ${item.category} ${item.brand || ""} ${item.color || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [reports, selectedType, selectedCategory, searchQuery]);

  // Submit new report & trigger Proactive Push Matching!
  const handleCreateReport = async (newReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);

    // Proactive background matching simulation against opposite reports
    const opposites = updated.filter(r => r.type !== newReport.type);
    for (const opp of opposites.slice(0, 3)) {
      try {
        const lost = newReport.type === "lost" ? newReport : opp;
        const found = newReport.type === "lost" ? opp : newReport;
        const matchResult = await runMultimodalMatch(lost, found, apiKey);
        
        if (matchResult.overallScore >= 75) {
          const newNotif = {
            id: `notif-${Date.now()}`,
            title: `Proactive Match: ${matchResult.overallScore}% Confidence`,
            message: `New report "${newReport.title}" automatically matched with "${opp.title}".`,
            score: matchResult.overallScore,
            timeAgo: "Just now",
            read: false,
            pair: { lost, found }
          };
          setNotifications(prev => [newNotif, ...prev]);
          break;
        }
      } catch (err) {
        console.error("Proactive match check error:", err);
      }
    }
  };

  // Trigger match from card or details
  const handleTriggerMatch = (item) => {
    if (item.type === "lost") {
      const targetFound = reports.find(r => r.id === item.targetMatchId) || reports.find(r => r.type === "found");
      setSelectedPair({ lost: item, found: targetFound });
    } else {
      const targetLost = reports.find(r => r.id === item.targetMatchId) || reports.find(r => r.type === "lost");
      setSelectedPair({ lost: targetLost, found: item });
    }
    setActiveTab("matches");
  };

  // Notification click handler
  const handleSelectNotification = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.pair) {
      setSelectedPair(notif.pair);
      setActiveTab("matches");
    }
  };

  // Complete Handoff
  const handleHandoffComplete = (itemId) => {
    setReports(prev => prev.map(r => r.id === itemId ? { ...r, status: "resolved" } : r));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenTour={() => setJudgeTourModalOpen(true)}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "feed" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
            
            {/* Hero / Pitch Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-slate-800 p-6 sm:p-8 shadow-2xl">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next-Gen Smart Campus Ecosystem</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Multimodal AI Lost & Found with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Anti-Fraud Verification</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  Powered by Google Gemini Vision & Text reasoning. Analyzes physical damage, stickers, and campus geography simultaneously, protecting items with dynamic AI ownership challenges.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Report Lost or Found Item</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPair({
                        lost: INITIAL_REPORTS[0],
                        found: INITIAL_REPORTS[1]
                      });
                      setActiveTab("matches");
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center space-x-2 transition-colors"
                  >
                    <GitMerge className="w-4 h-4 text-emerald-400" />
                    <span>Test Multimodal Match Engine</span>
                  </button>
                </div>
              </div>

              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-1/4 -mb-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2">
              
              {/* Type Switcher */}
              <div className="flex items-center p-1 bg-slate-900 rounded-2xl border border-slate-800 w-full md:w-auto">
                {["all", "lost", "found"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      selectedType === type
                        ? type === "lost"
                          ? "bg-rose-600 text-white shadow-md shadow-rose-950"
                          : type === "found"
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                          : "bg-slate-800 text-white shadow-md"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {type === "all" ? "All Items" : type === "lost" ? "• Lost Only" : "• Found Only"}
                  </button>
                ))}
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 md:max-w-xl justify-end">
                
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search color, stickers, brand, location..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All Categories">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

              </div>
            </div>

            {/* Item Cards Grid */}
            {filteredReports.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-3">
                <Search className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Matching Reports Found</h4>
                <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
                <button
                  onClick={() => {
                    setSelectedType("all");
                    setSelectedCategory("All Categories");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-emerald-400 hover:bg-slate-700"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onInspect={(itm) => setDetailsModalItem(itm)}
                    onTriggerMatch={handleTriggerMatch}
                    onStartClaim={(itm) => setClaimModalItem(itm)}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Multimodal AI Match Hub */}
        {activeTab === "matches" && (
          <MatchHub
            reports={reports}
            apiKey={apiKey}
            selectedPair={selectedPair}
            onSelectPair={(pair) => setSelectedPair(pair)}
            onStartClaimVerification={(item) => setClaimModalItem(item)}
            onOpenHandoff={(item) => setHandoffModalItem(item)}
          />
        )}

        {/* Tab 3: Safe Handoff Vault */}
        {activeTab === "vault" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
            <div className="pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Safe Handoff Vault & Claim Tickets
                </h1>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Encrypted exchange protocols, scannable QR verification tickets, and supervised campus pickup zones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.filter(r => r.status === "resolved" || r.isPreSeeded).slice(0, 4).map((item) => (
                <div 
                  key={item.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-2xl object-cover border border-slate-800" />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-emerald-400 block font-mono">{item.id}</span>
                        <h3 className="text-base font-bold text-white">{item.title}</h3>
                        <span className="text-xs text-slate-400">{item.location}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase">
                      Handoff Ready
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-400 font-mono">PIN: 749-102</span>
                    <span className="text-emerald-400 font-semibold">Central Library Desk</span>
                  </div>

                  <button
                    onClick={() => setHandoffModalItem(item)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>View Digital Claim Ticket & QR</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Campus Analytics */}
        {activeTab === "analytics" && (
          <AnalyticsView reports={reports} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Campus Find (RECOVER-X)</span>
            <span>•</span>
            <span>Google for Developers "Build with AI" Hackathon</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setJudgeTourModalOpen(true)} className="hover:text-emerald-400 transition-colors">
              Judge Pitch Summary
            </button>
            <button onClick={() => setApiKeyModalOpen(true)} className="hover:text-emerald-400 transition-colors">
              Gemini Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmitReport={handleCreateReport}
        apiKey={apiKey}
      />

      <ItemDetailsModal
        isOpen={Boolean(detailsModalItem)}
        onClose={() => setDetailsModalItem(null)}
        item={detailsModalItem}
        onTriggerMatch={handleTriggerMatch}
        onStartClaim={(item) => setClaimModalItem(item)}
      />

      <ClaimVerificationModal
        isOpen={Boolean(claimModalItem)}
        onClose={() => setClaimModalItem(null)}
        item={claimModalItem}
        apiKey={apiKey}
        onVerificationSuccess={(item) => {
          setHandoffModalItem(item);
        }}
      />

      <SafeHandoffModal
        isOpen={Boolean(handoffModalItem)}
        onClose={() => setHandoffModalItem(null)}
        item={handoffModalItem}
        onHandoffComplete={handleHandoffComplete}
      />

      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      <JudgeTourModal
        isOpen={judgeTourModalOpen}
        onClose={() => setJudgeTourModalOpen(false)}
        onJumpToTab={(tab) => setActiveTab(tab)}
        onLaunchDemoMatch={() => {
          setSelectedPair({
            lost: INITIAL_REPORTS[0],
            found: INITIAL_REPORTS[1]
          });
        }}
        onLaunchDemoClaim={() => {
          setClaimModalItem(INITIAL_REPORTS[0]);
        }}
      />

    </div>
  );
}
