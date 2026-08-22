import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Plus, Sparkles, MapPin, Clock, 
  ShieldCheck, GitMerge, Compass, Tag, Layers, RefreshCw,
  QrCode, Lock, CheckCircle2, ChevronRight, Bell, AlertCircle, Menu, Sun, Moon
} from "lucide-react";

import Sidebar from "./components/Sidebar";
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
  // Theme State: Default to Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("campus_find_theme");
    return saved ? saved === "dark" : true; // default dark
  });

  // Mobile sidebar drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (title, subtitle) => {
    setToastMessage({ title, subtitle });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("campus_find_theme", next ? "dark" : "light");
      return next;
    });
  };

  // Proactive Push Notifications
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "High-Confidence AI Match Detected",
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
    showToast("Gemini Settings Saved", key ? "Live Gemini 1.5/2.0 API enabled." : "Smart fallback neural reasoning active.");
  };

  // Filtered reports for Campus Explorer
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      if (selectedType !== "all" && item.type !== selectedType) return false;
      if (selectedCategory !== "All Categories" && item.category !== selectedCategory) return false;
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
    showToast("Report Submitted Successfully", `Proactive AI Radar scanning campus database for ${newReport.title}...`);

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
            message: `"${newReport.title}" automatically matched with "${opp.title}".`,
            score: matchResult.overallScore,
            timeAgo: "Just now",
            read: false,
            pair: { lost, found }
          };
          setNotifications(prev => [newNotif, ...prev]);
          showToast(`Proactive Match (${matchResult.overallScore}%)`, `High-confidence match found for ${newReport.title}`);
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
    showToast("Handoff Completed", "Item marked as resolved in campus records.");
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? "bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white" : "bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white"
    }`}>
      
      {/* Persistent Desktop / Drawer Mobile Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={() => setReportModalOpen(true)}
        onOpenTour={() => setJudgeTourModalOpen(true)}
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Layout Container (Offset by Sidebar on Desktop) */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        
        {/* Mobile Top Header */}
        <header className={`md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b ${
          darkMode ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-slate-200"
        } backdrop-blur-md`}>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl border border-slate-700/60 text-slate-300"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-1.5 font-black text-base">
              <span>Campus<span className="text-emerald-500">Find</span></span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleTheme}
              className="p-2 rounded-xl border border-slate-700/60 text-slate-300"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-sm"
            >
              + Report
            </button>
          </div>
        </header>

        {/* Floating Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-toast">
            <div className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 max-w-sm ${
              darkMode ? "bg-slate-900 border-emerald-500/50 text-white" : "bg-white border-emerald-500 text-slate-900"
            }`}>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold">{toastMessage.title}</h5>
                <p className={`text-[11px] mt-0.5 leading-snug ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                  {toastMessage.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1">
          {activeTab === "feed" && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
              
              {/* Hero Banner */}
              <div className={`relative rounded-3xl overflow-hidden border p-6 sm:p-8 shadow-xl ${
                darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Next-Gen Smart Campus Ecosystem</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                    Multimodal AI Lost & Found with <span className="text-emerald-500">Anti-Fraud Verification</span>
                  </h1>

                  <p className={`text-sm sm:text-base leading-relaxed font-medium ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}>
                    Powered by Google Gemini Vision & Text reasoning. Analyzes physical damage, stickers, and campus geography simultaneously, protecting items with dynamic AI ownership challenges.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setReportModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
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
                      className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-colors ${
                        darkMode 
                          ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200" 
                          : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800"
                      }`}
                    >
                      <GitMerge className="w-4 h-4 text-emerald-500" />
                      <span>Test Multimodal Match Hub</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-2">
                
                {/* Type Switcher */}
                <div className={`flex items-center p-1 rounded-2xl border w-full md:w-auto ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  {["all", "lost", "found"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        selectedType === type
                          ? type === "lost"
                            ? "bg-rose-600 text-white shadow-sm"
                            : type === "found"
                            ? "bg-emerald-600 text-white shadow-sm"
                            : darkMode ? "bg-slate-800 text-white" : "bg-slate-900 text-white"
                          : darkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
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
                    <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search color, stickers, brand, location..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-emerald-500 transition-colors ${
                        darkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                      aria-label="Search campus reports"
                    />
                  </div>

                  {/* Category Dropdown */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-emerald-500 ${
                      darkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                    }`}
                    aria-label="Filter by Category"
                  >
                    <option value="All Categories">All Categories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>

                </div>
              </div>

              {/* Item Cards Grid / Empty State */}
              {filteredReports.length === 0 ? (
                <div className={`py-16 text-center rounded-3xl border p-8 space-y-3 ${
                  darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                }`}>
                  <Search className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-base font-bold">No Matching Reports Found</h4>
                  <p className={`text-xs max-w-sm mx-auto ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    No campus reports match your search query or filter selection.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedCategory("All Categories");
                      setSearchQuery("");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold text-emerald-500 transition-colors ${
                      darkMode ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    Reset Filters & View All
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
              <div className="pb-6 border-b border-slate-800/80">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Safe Handoff Vault & Claim Tickets
                  </h1>
                </div>
                <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Encrypted exchange protocols, scannable QR verification tickets, and supervised campus pickup zones.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.filter(r => r.status === "resolved" || r.isPreSeeded).slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    className={`rounded-3xl border p-6 space-y-4 shadow-md flex flex-col justify-between ${
                      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.title} className="w-14 h-14 rounded-2xl object-cover border border-slate-700/60" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-500 block font-mono">{item.id}</span>
                          <h3 className="text-base font-bold">{item.title}</h3>
                          <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>{item.location}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-extrabold uppercase">
                        Handoff Ready
                      </span>
                    </div>

                    <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                      darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
                    }`}>
                      <span className="font-mono font-bold text-slate-400">PIN: 749-102</span>
                      <span className="text-emerald-500 font-bold">Central Library Desk</span>
                    </div>

                    <button
                      onClick={() => setHandoffModalItem(item)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                        darkMode ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                      }`}
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
        <footer className={`mt-16 border-t py-8 px-4 sm:px-6 lg:px-8 text-xs ${
          darkMode ? "border-slate-800 bg-slate-950/80 text-slate-400" : "border-slate-200 bg-white text-slate-500"
        }`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold">Campus Find (RECOVER-X)</span>
              <span>•</span>
              <span>PromptWars x YenTech • Google for Developers</span>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setJudgeTourModalOpen(true)} className="hover:text-emerald-500 transition-colors font-medium">
                Judge Pitch Summary
              </button>
              <button onClick={() => setApiKeyModalOpen(true)} className="hover:text-emerald-500 transition-colors font-medium">
                Gemini Settings
              </button>
            </div>
          </div>
        </footer>

      </div>

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
