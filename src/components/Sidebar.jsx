import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Bell, Plus, Compass, GitMerge, ShieldCheck, 
  BarChart3, Settings, Sun, Moon, Check, X, Menu, Lock
} from "lucide-react";

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenReportModal, 
  onOpenTour, 
  onOpenApiKeyModal, 
  hasApiKey,
  notifications = [],
  onSelectNotification,
  darkMode,
  onToggleTheme,
  mobileOpen,
  onCloseMobile
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const notifRef = useRef(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: "feed", label: "Campus Explorer", icon: Compass },
    { id: "matches", label: "AI Match Hub", icon: GitMerge, badge: "4 pairs" },
    { id: "vault", label: "Safe Handoff", icon: ShieldCheck },
    { id: "analytics", label: "Campus Metrics", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Persistent Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between border-r transition-transform duration-300 ease-out md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        darkMode 
          ? "bg-slate-950 border-slate-800/80 text-slate-100" 
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}>
        
        {/* Top Section: Brand & Quick Action */}
        <div className="p-5 space-y-5">
          
          {/* Logo Row */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => {
                setActiveTab("feed");
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:bg-emerald-400 transition-colors">
                <Sparkles className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-black tracking-tight">
                    Campus<span className="text-emerald-500">Find</span>
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    darkMode 
                      ? "bg-slate-800 text-emerald-400 border border-slate-700" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    RECOVER-X
                  </span>
                </div>
                <p className={`text-[11px] font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Smart Lost & Found AI
                </p>
              </div>
            </button>

            {/* Mobile close X button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hackathon Badge Pill */}
          <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
            darkMode 
              ? "bg-slate-900/90 border-slate-800 text-slate-300" 
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-bold">Build with AI</span>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
              darkMode ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-emerald-100 text-emerald-800"
            }`}>
              Gemini Vision
            </span>
          </div>

          {/* Primary Action Button: Report Item */}
          <button
            onClick={() => {
              onOpenReportModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Report Lost / Found</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    isActive
                      ? darkMode
                        ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                      : darkMode
                        ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? (darkMode ? "text-emerald-400" : "text-emerald-600") : ""}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive 
                        ? darkMode ? "bg-emerald-950 text-emerald-300" : "bg-emerald-100 text-emerald-800"
                        : darkMode ? "bg-slate-800 text-slate-400" : "bg-slate-200 text-slate-600"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Controls */}
        <div className={`p-4 border-t space-y-3 ${
          darkMode ? "border-slate-800/80 bg-slate-950" : "border-slate-200 bg-slate-50"
        }`}>
          
          {/* Notifications Row */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-full px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors border ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700" 
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Bell className="w-4 h-4 text-emerald-500" />
                <span>AI Push Radar</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500 text-slate-950">
                  {unreadCount} new
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer in Sidebar */}
            {showNotifications && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-2xl border shadow-2xl p-4 z-50 animate-toast ${
                darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Radar Alerts
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold">Live AI</span>
                </div>

                <div className="mt-2.5 space-y-2 max-h-56 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onSelectNotification(notif);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        notif.read
                          ? darkMode ? "bg-slate-950/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
                          : darkMode ? "bg-emerald-950/40 border-emerald-700 text-slate-200" : "bg-emerald-50 border-emerald-300 text-slate-800"
                      }`}
                    >
                      <div className="font-bold mb-0.5 flex justify-between">
                        <span>{notif.title}</span>
                        <span className="text-[10px] font-normal">{notif.timeAgo}</span>
                      </div>
                      <p className="text-[11px] line-clamp-2 leading-snug">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher & Pitch row */}
          <div className="grid grid-cols-2 gap-2">
            
            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>Dark</span>
                </>
              )}
            </button>

            {/* API Settings */}
            <button
              onClick={onOpenApiKeyModal}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Gemini</span>
              <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
            </button>
          </div>

          {/* 60s Judge Pitch Button */}
          <button
            onClick={onOpenTour}
            className="w-full py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Judge Pitch Guide (60s)</span>
          </button>

        </div>

      </aside>
    </>
  );
}
