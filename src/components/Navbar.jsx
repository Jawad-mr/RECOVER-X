import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Bell, Plus, Compass, GitMerge, ShieldCheck, 
  BarChart3, Settings, Check, X, Layers, ExternalLink
} from "lucide-react";

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  onOpenTour, 
  onOpenApiKeyModal, 
  hasApiKey,
  notifications = [],
  onSelectNotification,
  onClearNotifications
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const notifRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      {/* Top micro-bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-2.5">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800 text-[11px]">
            Google for Developers
          </span>
          <span className="text-slate-400 hidden sm:inline">Build with AI • Multimodal Gemini Reasoning</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden md:inline">Proactive AI Radar Online</span>
          </div>
          <button
            onClick={onOpenTour}
            className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition-colors text-xs"
            aria-label="Open 60-second judge pitch guide"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="underline decoration-amber-400/50 underline-offset-2">Judge Pitch (60s)</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setActiveTab("feed")}
              className="flex items-center space-x-3 text-left group focus:outline-none"
              aria-label="Campus Find Home"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:bg-emerald-400 transition-colors">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black tracking-tight text-white">
                    Campus<span className="text-emerald-400">Find</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-emerald-300 border border-slate-700 font-bold">
                    RECOVER-X
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden md:block">
                  Smart Campus Lost & Found System
                </p>
              </div>
            </button>

            {/* Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1.5 pl-2" aria-label="Main Navigation">
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  activeTab === "feed"
                    ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Campus Explorer</span>
              </button>

              <button
                onClick={() => setActiveTab("matches")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  activeTab === "matches"
                    ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <GitMerge className="w-4 h-4 text-emerald-400" />
                <span>AI Match Hub</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  4 pairs
                </span>
              </button>

              <button
                onClick={() => setActiveTab("vault")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  activeTab === "vault"
                    ? "bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Safe Handoff</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
                  activeTab === "analytics"
                    ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Metrics</span>
              </button>
            </nav>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center space-x-3">
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                title="Proactive Push Notifications"
                aria-label={`Notifications, ${unreadCount} unread`}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-scale-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Proactive Match Alerts
                    </h4>
                    <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-800 font-semibold">
                      Real-Time AI Radar
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        <p className="font-semibold text-slate-300">No Notifications</p>
                        <p className="text-[11px] text-slate-500 mt-1">You're all caught up on campus match alerts.</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onSelectNotification(notif);
                            setShowNotifications(false);
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            notif.read
                              ? "bg-slate-950/60 border-slate-800 text-slate-400"
                              : "bg-emerald-950/40 border-emerald-600/40 text-slate-200 hover:bg-emerald-950/60"
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-white mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${notif.read ? 'bg-slate-600' : 'bg-emerald-400'}`}></span>
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">{notif.timeAgo}</span>
                          </div>
                          <p className="text-slate-300 leading-snug text-xs">{notif.message}</p>
                          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold">
                            <span>Score: {notif.score}%</span>
                            <span className="underline">Inspect Match →</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* API Settings */}
            <button
              onClick={onOpenApiKeyModal}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
              title="Gemini API Configuration"
              aria-label="Gemini API Settings"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
            </button>

            {/* Primary Action: Report Item */}
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              aria-label="Report a Lost or Found Item"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Report Item</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-800" aria-label="Mobile Navigation">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center text-xs font-semibold ${
              activeTab === "feed" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab("matches")}
            className={`flex flex-col items-center text-xs font-semibold ${
              activeTab === "matches" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            <GitMerge className="w-4 h-4 mb-0.5" />
            <span>AI Matches</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`flex flex-col items-center text-xs font-semibold ${
              activeTab === "vault" ? "text-cyan-400 font-bold" : "text-slate-400"
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span>Handoff</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex flex-col items-center text-xs font-semibold ${
              activeTab === "analytics" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            <BarChart3 className="w-4 h-4 mb-0.5" />
            <span>Metrics</span>
          </button>
        </div>
      </div>
    </header>
  );
}
