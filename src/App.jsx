import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Plus, MapPin, Clock, 
  ShieldCheck, GitMerge, Compass, Tag, Layers, RefreshCw,
  QrCode, Lock, CheckCircle2, ChevronRight, Bell, AlertCircle, Menu, Sun, Moon, FilePlus2, Triangle
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import ItemCard from "./components/ItemCard";
import MatchHub from "./components/MatchHub";
import ReportPage from "./components/ReportPage";
import ItemDetailsModal from "./components/ItemDetailsModal";
import ClaimVerificationModal from "./components/ClaimVerificationModal";
import SafeHandoffModal from "./components/SafeHandoffModal";
import AnalyticsView from "./components/AnalyticsView";
import CampusMapScanner from "./components/CampusMapScanner";
import FeaturesShowcase from "./components/FeaturesShowcase";
import SmartTagModal from "./components/SmartTagModal";

import { INITIAL_REPORTS, CATEGORIES, CAMPUS_LOCATIONS } from "./data/seedData";
import { runMultimodalMatch } from "./services/geminiService";

export default function App() {
  // Theme State: Default to Dark Mode (Vercel Black)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("campus_find_theme");
    return saved ? saved === "dark" : true;
  });

  // Mobile sidebar drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem("campus_find_reports");
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [activeTab, setActiveTab] = useState("feed"); // "feed" | "report" | "matches" | "vault" | "analytics"
  const [selectedType, setSelectedType] = useState("all"); // "all" | "lost" | "found"
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [detailsModalItem, setDetailsModalItem] = useState(null);
  const [claimModalItem, setClaimModalItem] = useState(null);
  const [handoffModalItem, setHandoffModalItem] = useState(null);
  const [smartTagModalOpen, setSmartTagModalOpen] = useState(false);

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
      title: "Potential Match Detected",
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
      title: "Match Alert: Hydro Flask",
      message: "Teal Hydro Flask (REP-9003) matched with Gym report (REP-9004) at 94%.",
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

  // Filtered reports for Campus Explorer
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      if (selectedType !== "all" && item.type !== selectedType) return false;
      if (selectedCategory !== "All Categories" && item.category !== selectedCategory) return false;
      if (selectedLocation && !item.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const text = `${item.title} ${item.description} ${item.location} ${item.category} ${item.brand || ""} ${item.color || ""}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [reports, selectedType, selectedCategory, selectedLocation, searchQuery]);

  // Submit new report & trigger Proactive Push Matching!
  const handleCreateReport = async (newReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    setActiveTab("feed");
    showToast("Report Submitted", `Scanning campus records for ${newReport.title}...`);

    const opposites = updated.filter(r => r.type !== newReport.type);
    for (const opp of opposites.slice(0, 3)) {
      try {
        const lost = newReport.type === "lost" ? newReport : opp;
        const found = newReport.type === "lost" ? opp : newReport;
        const matchResult = await runMultimodalMatch(lost, found, "");
        
        if (matchResult.overallScore >= 75) {
          const newNotif = {
            id: `notif-${Date.now()}`,
            title: `Match Found (${matchResult.overallScore}% Confidence)`,
            message: `"${newReport.title}" matched with "${opp.title}".`,
            score: matchResult.overallScore,
            timeAgo: "Just now",
            read: false,
            pair: { lost, found }
          };
          setNotifications(prev => [newNotif, ...prev]);
          showToast(`Match Detected (${matchResult.overallScore}%)`, `Potential match found for ${newReport.title}`);
          break;
        }
      } catch (err) {
        console.error("Proactive match error:", err);
      }
    }
  };

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

  const handleSelectNotification = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.pair) {
      setSelectedPair(notif.pair);
      setActiveTab("matches");
    }
  };

  const handleHandoffComplete = (itemId) => {
    setReports(prev => prev.map(r => r.id === itemId ? { ...r, status: "resolved" } : r));
    showToast("Handoff Complete", "Item marked as resolved.");
  };

  return (
    <div className={`min-h-screen transition-colors duration-150 ${
      darkMode ? "bg-black text-zinc-100 selection:bg-zinc-800 selection:text-white" : "bg-white text-zinc-900 selection:bg-zinc-200 selection:text-black"
    }`}>
      
      {/* Vercel-Style Persistent Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSmartTag={() => setSmartTagModalOpen(true)}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
        darkMode={darkMode}
        onToggleTheme={handleToggleTheme}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Layout Container (Offset by Sidebar on Desktop) */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        
        {/* Mobile Top Header */}
        <header className={`md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b ${
          darkMode ? "bg-black/95 border-zinc-800" : "bg-white/95 border-zinc-200"
        } backdrop-blur-md`}>
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-zinc-800 text-zinc-300"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-1.5 font-mono font-bold text-sm">
              <span>RECOVER<span className="text-zinc-400">-X</span></span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleTheme}
              className="p-1.5 rounded-lg border border-zinc-800 text-zinc-300"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 text-zinc-400" /> : <Moon className="w-3.5 h-3.5 text-zinc-700" />}
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className="px-2.5 py-1 rounded-lg bg-white text-black font-semibold text-xs shadow-sm"
            >
              + Report
            </button>
          </div>
        </header>

        {/* Floating Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-toast">
            <div className={`p-3.5 rounded-xl border shadow-2xl flex items-start gap-2.5 max-w-sm ${
              darkMode ? "bg-zinc-950 border-zinc-750 text-white" : "bg-white border-zinc-300 text-black"
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-semibold">{toastMessage.title}</h5>
                <p className="text-[11px] mt-0.5 text-zinc-400 leading-snug">
                  {toastMessage.subtitle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1">
          {/* TAB 1: OVERVIEW / CAMPUS EXPLORER */}
          {activeTab === "feed" && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
              
              {/* Vercel-Style Minimalist Hero Header */}
              <div className={`relative rounded-2xl overflow-hidden border p-6 sm:p-8 ${
                darkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
              }`}>
                <div className="relative z-10 max-w-3xl space-y-3">
                  <div className="inline-flex items-center space-x-2 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Radar Active • Automated Match Engine</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                    Next-Gen Lost & Found System
                  </h1>

                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 font-normal">
                    Real-time item recovery with multimodal visual matching, anti-fraud verification challenges, and supervised safe handoff kiosks.
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      onClick={() => setActiveTab("report")}
                      className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-sm flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Report Item</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedPair({
                          lost: INITIAL_REPORTS[0],
                          found: INITIAL_REPORTS[1]
                        });
                        setActiveTab("matches");
                      }}
                      className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <GitMerge className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Match Hub</span>
                    </button>

                    <button
                      onClick={() => setSmartTagModalOpen(true)}
                      className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Print Safe-Tag</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* FEATURES SHOWCASE */}
              <FeaturesShowcase
                onOpenSmartTag={() => setSmartTagModalOpen(true)}
                onJumpToMatches={() => setActiveTab("matches")}
                onJumpToVault={() => setActiveTab("vault")}
                darkMode={darkMode}
              />

              {/* CAMPUS MAP & KIOSKS */}
              <CampusMapScanner
                reports={reports}
                selectedLocation={selectedLocation}
                onSelectLocationFilter={(loc) => setSelectedLocation(loc)}
                darkMode={darkMode}
              />

              {/* Search & Filter Controls */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between pb-1 pt-2">
                
                {/* Type Switcher */}
                <div className={`flex items-center p-1 rounded-xl border w-full md:w-auto ${
                  darkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200"
                }`}>
                  {["all", "lost", "found"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        selectedType === type
                          ? darkMode ? "bg-zinc-850 text-white font-semibold" : "bg-white text-black font-semibold shadow-sm"
                          : darkMode ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
                      }`}
                    >
                      {type === "all" ? "All Items" : type === "lost" ? "• Lost" : "• Found"}
                    </button>
                  ))}
                </div>

                {/* Search Bar & Category Dropdown */}
                <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto flex-1 md:max-w-xl justify-end">
                  
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items, stickers, colors, serials..."
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-zinc-500 transition-colors ${
                        darkMode ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500" : "bg-white border-zinc-350 text-black placeholder-zinc-400"
                      }`}
                      aria-label="Search campus reports"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-zinc-500 ${
                      darkMode ? "bg-zinc-950 border-zinc-800 text-zinc-300" : "bg-white border-zinc-350 text-black"
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

              {/* Items Grid */}
              {filteredReports.length === 0 ? (
                <div className={`py-14 text-center rounded-2xl border p-8 space-y-2.5 ${
                  darkMode ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                }`}>
                  <Search className="w-8 h-8 text-zinc-600 mx-auto" />
                  <h4 className="text-sm font-semibold">No Items Found</h4>
                  <p className="text-xs text-zinc-400">
                    {selectedLocation ? `No reports found for ${selectedLocation}.` : "No items match your active search filters."}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedCategory("All Categories");
                      setSelectedLocation(null);
                      setSearchQuery("");
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

          {/* TAB 2: REPORT PAGE */}
          {activeTab === "report" && (
            <ReportPage
              onSubmitReport={handleCreateReport}
              onNavigateBack={() => setActiveTab("feed")}
              darkMode={darkMode}
            />
          )}

          {/* TAB 3: AI MATCH HUB */}
          {activeTab === "matches" && (
            <MatchHub
              reports={reports}
              selectedPair={selectedPair}
              onSelectPair={(pair) => setSelectedPair(pair)}
              onStartClaimVerification={(item) => setClaimModalItem(item)}
              onOpenHandoff={(item) => setHandoffModalItem(item)}
            />
          )}

          {/* TAB 4: SAFE HANDOFF VAULT */}
          {activeTab === "vault" && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-zinc-800">
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Safe Handoff Vault & Claim Tickets
                </h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Supervised pickup kiosks, 6-digit verification PINs, and scannable claim tickets
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.filter(r => r.status === "resolved" || r.isPreSeeded).slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    className={`rounded-2xl border p-5 space-y-3 flex flex-col justify-between ${
                      darkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-xl object-cover border border-zinc-800" />
                        <div>
                          <span className="text-[10px] font-bold uppercase text-emerald-400 block font-mono">{item.id}</span>
                          <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                          <span className="text-xs text-zinc-400">{item.location}</span>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300">
                        Ready
                      </span>
                    </div>

                    <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between font-mono ${
                      darkMode ? "bg-black border-zinc-850" : "bg-zinc-50 border-zinc-200"
                    }`}>
                      <span className="text-zinc-400">PIN: 749-102</span>
                      <span className="text-zinc-200 font-sans">Central Library Desk</span>
                    </div>

                    <button
                      onClick={() => setHandoffModalItem(item)}
                      className="w-full py-2 rounded-lg font-semibold text-xs bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5 text-zinc-400" />
                      <span>View Claim Ticket & QR</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CAMPUS METRICS */}
          {activeTab === "analytics" && (
            <AnalyticsView reports={reports} />
          )}
        </main>

        {/* Vercel-Style Minimalist Footer */}
        <footer className={`mt-16 border-t py-6 px-4 sm:px-6 lg:px-8 text-xs ${
          darkMode ? "border-zinc-850 bg-black text-zinc-500" : "border-zinc-200 bg-white text-zinc-500"
        }`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
            <div className="flex items-center space-x-2">
              <Triangle className="w-3 h-3 fill-zinc-400 stroke-none" />
              <span className="font-semibold text-zinc-400">RECOVER-X</span>
              <span>•</span>
              <span>Smart Lost & Found</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSmartTagModalOpen(true)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                QR Safe-Tags
              </button>
              <span>Zero-Knowledge Verification</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Modals */}
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

      <SmartTagModal
        isOpen={smartTagModalOpen}
        onClose={() => setSmartTagModalOpen(false)}
      />

    </div>
  );
}
