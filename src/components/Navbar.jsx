import React, { useState } from "react";
import { 
  Sparkles, Bell, Plus, Compass, GitMerge, ShieldCheck, 
  BarChart3, Settings, HelpCircle, CheckCircle2, ChevronDown,
  Layers, MapPin
} from "lucide-react";

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  onOpenTour, 
  onOpenApiKeyModal, 
  hasApiKey,
  notifications = [],
  onSelectNotification
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl transition-all">
      {/* Top micro-bar with hackathon identifier */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/40 to-cyan-950/60 border-b border-slate-800/40 px-4 py-1 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30 text-[10px]">
            Google for Developers
          </span>
          <span className="hidden sm:inline">Build with AI Hackathon • Multimodal Gemini Reasoning</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-medium">Proactive Match Radar Active</span>
          </div>
          <button
            onClick={onOpenTour}
            className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="underline decoration-amber-400/40 underline-offset-2">60-Sec Judge Tour</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <div 
              onClick={() => setActiveTab("feed")}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 font-bold" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black tracking-tight text-white font-sans">
                    Campus<span className="text-emerald-400">Find</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-emerald-400 border border-slate-700">
                    RECOVER-X
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden md:block">
                  Smart AI Lost & Found Ecosystem
                </p>
              </div>
            </div>

            {/* Navigation Tabs (Desktop) */}
            <nav className="hidden md:flex items-center space-x-1 pl-2">
              <button
                onClick={() => setActiveTab("feed")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                  activeTab === "feed"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Campus Explorer</span>
              </button>

              <button
                onClick={() => setActiveTab("matches")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all relative ${
                  activeTab === "matches"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <GitMerge className="w-4 h-4 text-emerald-400" />
                <span>AI Match Hub</span>
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                  4 pairs
                </span>
              </button>

              <button
                onClick={() => setActiveTab("vault")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                  activeTab === "vault"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Safe Handoff Vault</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                  activeTab === "analytics"
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
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
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                title="Proactive Push Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Tray */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-scale-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Proactive Match Notifications
                    </h4>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                      Real-Time AI Radar
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No new push notifications</p>
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
                              ? "bg-slate-950/40 border-slate-800/60 text-slate-400"
                              : "bg-emerald-950/30 border-emerald-500/30 text-slate-200 hover:bg-emerald-950/50"
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold text-white mb-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{notif.timeAgo}</span>
                          </div>
                          <p className="text-slate-300 leading-snug">{notif.message}</p>
                          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                            <span>Score: {notif.score}% Confidence</span>
                            <span className="underline">View AI Explanation →</span>
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
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors flex items-center gap-1.5"
              title="Gemini Multimodal Settings"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
            </button>

            {/* Quick Tour Button */}
            <button
              onClick={onOpenTour}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Judge Pitch</span>
            </button>

            {/* Primary Action: Report Lost / Found */}
            <button
              onClick={onOpenReportModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center space-x-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Report Item</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center text-[11px] ${
              activeTab === "feed" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            <Compass className="w-4 h-4 mb-0.5" />
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab("matches")}
            className={`flex flex-col items-center text-[11px] ${
              activeTab === "matches" ? "text-emerald-400 font-bold" : "text-slate-400"
            }`}
          >
            <GitMerge className="w-4 h-4 mb-0.5" />
            <span>AI Matches</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`flex flex-col items-center text-[11px] ${
              activeTab === "vault" ? "text-cyan-400 font-bold" : "text-slate-400"
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span>Handoff</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex flex-col items-center text-[11px] ${
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
