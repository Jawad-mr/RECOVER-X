import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, Plus, MapPin, Clock, 
  ShieldCheck, GitMerge, Compass, Tag, Layers, RefreshCw,
  QrCode, Lock, CheckCircle2, ChevronRight, Bell, AlertCircle, Menu, Sun, Moon, FilePlus2, Sparkles
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
import RecoverXLogo from "./components/RecoverXLogo";
import IntroSplashScreen from "./components/IntroSplashScreen";

import { INITIAL_REPORTS, CATEGORIES, CAMPUS_LOCATIONS } from "./data/seedData";
import { runMultimodalMatch } from "./services/geminiService";

export default function App() {
  // Intro splash screen state
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("recover_x_intro_seen");
  });

  const handleCompleteSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem("recover_x_intro_seen", "true");
  };

  // Theme State: Default to Dark Mode (Google Material Dark)
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
      darkMode ? "bg-[#121212] text-[#e8eaed] selection:bg-[#4285F4]/30 selection:text-white" : "bg-[#f8fafd] text-[#202124] selection:bg-[#4285F4]/30 selection:text-[#1a73e8]"
    }`}>
      
      {/* Persistent Left Sidebar (w-72) */}
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
        onReplayIntro={() => setShowSplash(true)}
      />

      {/* Main Layout Container */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        
        {/* Mobile Top Header */}
        <header className={`md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b ${
          darkMode ? "bg-[#1e1f20]/95 border-[#3c4043]" : "bg-white/95 border-[#dadce0]"
        } backdrop-blur-md`}>
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`p-1.5 rounded-full border ${
                darkMode ? "border-[#3c4043] text-[#e8eaed]" : "border-[#dadce0] text-[#202124]"
              }`}
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2">
              <RecoverXLogo className="w-7 h-7" />
              <div className="flex items-center text-sm font-black tracking-tight">
                <span className="text-[#4285F4]">R</span>
                <span className="text-[#EA4335]">E</span>
                <span className="text-[#FBBC05]">C</span>
                <span className="text-[#4285F4]">O</span>
                <span className="text-[#34A853]">V</span>
                <span className="text-[#EA4335]">E</span>
                <span className="text-[#4285F4]">R</span>
                <span className={darkMode ? "text-white" : "text-[#202124]"}>-X</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleTheme}
              className={`p-1.5 rounded-full border ${
                darkMode ? "border-[#3c4043] text-[#e8eaed]" : "border-[#dadce0] text-[#202124]"
              }`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-[#fbbc04]" /> : <Moon className="w-4 h-4 text-[#5f6368]" />}
            </button>
            <button
              onClick={() => setActiveTab("report")}
              className="px-3 py-1.5 rounded-full bg-[#1a73e8] text-white font-bold text-xs shadow-sm"
            >
              + Report
            </button>
          </div>
        </header>

        {/* Floating Toast Feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-toast">
            <div className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 max-w-sm ${
              darkMode ? "bg-[#202124] border-[#4285F4] text-white" : "bg-white border-[#1a73e8] text-[#202124]"
            }`}>
              <CheckCircle2 className="w-5 h-5 text-[#34a853] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold">{toastMessage.title}</h5>
                <p className={`text-[11px] mt-0.5 leading-snug ${
                  darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"
                }`}>
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
              
              {/* Hero Banner */}
              <div className={`relative rounded-3xl overflow-hidden border p-6 sm:p-8 shadow-md ${
                darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
              }`}>
                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold ${
                    darkMode ? "bg-[#1a73e8]/15 border-[#1a73e8]/30 text-[#8ab4f8]" : "bg-[#e8f0fe] border-[#aecbfa] text-[#1a73e8]"
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 text-[#4285F4]" />
                    <span>Smart Campus Lost & Found System</span>
                  </div>

                  <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                    darkMode ? "text-white" : "text-[#202124]"
                  }`}>
                    Recover lost items with <span className="text-[#4285F4]">Intelligent</span> <span className="text-[#34A853]">Visual Matching</span>
                  </h1>

                  <p className={`text-sm leading-relaxed font-medium ${
                    darkMode ? "text-[#bdc1c6]" : "text-[#5f6368]"
                  }`}>
                    Submit lost or found reports across campus. Our multimodal vision system cross-references physical hallmarks, damage patterns, and campus locations to suggest instant matches.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab("report")}
                      className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-md flex items-center space-x-2 transition-all transform hover:scale-105 active:scale-95"
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
                      className={`px-5 py-2.5 rounded-full border text-xs font-bold flex items-center space-x-2 transition-colors ${
                        darkMode 
                          ? "bg-[#2d2f31] hover:bg-[#3c4043] border-[#5f6368] text-white" 
                          : "bg-white hover:bg-[#f1f3f4] border-[#dadce0] text-[#202124] shadow-sm"
                      }`}
                    >
                      <GitMerge className="w-4 h-4 text-[#34a853]" />
                      <span>View Match Hub</span>
                    </button>

                    <button
                      onClick={() => setSmartTagModalOpen(true)}
                      className={`px-5 py-2.5 rounded-full border text-xs font-bold flex items-center space-x-2 transition-colors ${
                        darkMode 
                          ? "bg-[#fbbc04]/15 hover:bg-[#fbbc04]/25 border-[#fbbc04]/40 text-[#fdd663]" 
                          : "bg-[#fef7e0] hover:bg-[#feefc3] border-[#fce8b2] text-[#b06000]"
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-[#fbbc04]" />
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
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-1 pt-2">
                
                {/* Type Switcher */}
                <div className={`flex items-center p-1 rounded-full border w-full md:w-auto ${
                  darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-[#f1f3f4] border-[#dadce0]"
                }`}>
                  {["all", "lost", "found"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`flex-1 md:flex-none px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${
                        selectedType === type
                          ? type === "lost"
                            ? "bg-[#ea4335] text-white shadow-md"
                            : type === "found"
                            ? "bg-[#34a853] text-white shadow-md"
                            : "bg-[#1a73e8] text-white shadow-md"
                          : darkMode ? "text-[#9aa0a6] hover:text-white" : "text-[#5f6368] hover:text-[#202124]"
                      }`}
                    >
                      {type === "all" ? "All Items" : type === "lost" ? "• Lost Only" : "• Found Only"}
                    </button>
                  ))}
                </div>

                {/* Pill Search Bar & Dropdown */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1 md:max-w-xl justify-end">
                  
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-4 top-3 text-[#4285F4] pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items, decals, colors, serial numbers..."
                      className={`w-full pl-11 pr-4 py-2.5 rounded-full text-xs font-medium border focus:outline-none focus:border-[#4285F4] transition-colors shadow-sm ${
                        darkMode ? "bg-[#202124] border-[#3c4043] text-white placeholder-[#9aa0a6]" : "bg-white border-[#dadce0] text-[#202124] placeholder-[#5f6368]"
                      }`}
                      aria-label="Search campus reports"
                    />
                  </div>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold border focus:outline-none focus:border-[#4285F4] ${
                      darkMode ? "bg-[#202124] border-[#3c4043] text-[#e8eaed]" : "bg-white border-[#dadce0] text-[#202124]"
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
                <div className={`py-16 text-center rounded-3xl border p-8 space-y-3 ${
                  darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
                }`}>
                  <Search className="w-10 h-10 text-[#5f6368] mx-auto" />
                  <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>No Items Found</h4>
                  <p className={`text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
                    {selectedLocation ? `No reports found for ${selectedLocation}.` : "No items match your active search filters."}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedCategory("All Categories");
                      setSelectedLocation(null);
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-[#1a73e8] text-white shadow-md"
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
                      darkMode={darkMode}
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
              darkMode={darkMode}
            />
          )}

          {/* TAB 4: SAFE HANDOFF VAULT */}
          {activeTab === "vault" && (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
              <div className={`pb-4 border-b ${darkMode ? "border-[#3c4043]" : "border-[#dadce0]"}`}>
                <h1 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${
                  darkMode ? "text-white" : "text-[#202124]"
                }`}>
                  <ShieldCheck className="w-6 h-6 text-[#34a853]" />
                  <span>Safe Handoff Vault & Claim Tickets</span>
                </h1>
                <p className={`text-xs mt-0.5 ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
                  Supervised pickup kiosks, 6-digit verification PINs, and scannable claim tickets
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.filter(r => r.status === "resolved" || r.isPreSeeded).slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    className={`rounded-3xl border p-6 space-y-4 flex flex-col justify-between shadow-md ${
                      darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.title} className={`w-14 h-14 rounded-2xl object-cover border ${
                          darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
                        }`} />
                        <div>
                          <span className={`text-[10px] font-bold uppercase block font-mono ${
                            darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"
                          }`}>{item.id}</span>
                          <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>{item.title}</h3>
                          <span className={`text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>{item.location}</span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        darkMode ? "bg-[#34a853]/20 text-[#81c995] border-[#34a853]/40" : "bg-[#e6f4ea] text-[#137333] border-[#ceead6]"
                      }`}>
                        Ready
                      </span>
                    </div>

                    <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between font-mono ${
                      darkMode ? "bg-[#1e1f20] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
                    }`}>
                      <span className={darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}>PIN: 749-102</span>
                      <span className={`font-sans font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>Central Library Desk</span>
                    </div>

                    <button
                      onClick={() => setHandoffModalItem(item)}
                      className="w-full py-2.5 rounded-full font-bold text-xs bg-[#1a73e8] hover:bg-[#1557b0] text-white flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <QrCode className="w-4 h-4 text-white" />
                      <span>View Claim Ticket & QR</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CAMPUS METRICS */}
          {activeTab === "analytics" && (
            <AnalyticsView reports={reports} darkMode={darkMode} />
          )}
        </main>

        {/* Footer */}
        <footer className={`mt-16 border-t py-8 px-4 sm:px-6 lg:px-8 text-xs ${
          darkMode ? "border-[#3c4043] bg-[#1e1f20] text-[#9aa0a6]" : "border-[#dadce0] bg-white text-[#5f6368]"
        }`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
            <div className="flex items-center space-x-2">
              <RecoverXLogo className="w-6 h-6" />
              <div className="flex items-center text-sm font-black">
                <span className="text-[#4285F4]">R</span>
                <span className="text-[#EA4335]">E</span>
                <span className="text-[#FBBC05]">C</span>
                <span className="text-[#4285F4]">O</span>
                <span className="text-[#34A853]">V</span>
                <span className="text-[#EA4335]">E</span>
                <span className="text-[#4285F4]">R</span>
                <span className={darkMode ? "text-white" : "text-[#202124]"}>-X</span>
              </div>
              <span>•</span>
              <span>Smart Lost & Found</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSmartTagModalOpen(true)}
                className={`font-bold hover:underline ${
                  darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"
                }`}
              >
                + Print Device Safe-Tags
              </button>
              <span>Encrypted Data Protection</span>
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

      {/* Intro Boot Splash Screen */}
      {showSplash && (
        <IntroSplashScreen
          onComplete={handleCompleteSplash}
          darkMode={darkMode}
        />
      )}

    </div>
  );
}
