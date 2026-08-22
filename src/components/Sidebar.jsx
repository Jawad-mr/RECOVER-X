import React, { useState, useRef, useEffect } from "react";
import { 
  Bell, Plus, Compass, GitMerge, ShieldCheck, 
  BarChart3, Sun, Moon, Check, X, Shield, FilePlus2, QrCode, Triangle
} from "lucide-react";

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenSmartTag,
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
    { id: "feed", label: "Overview", icon: Compass },
    { id: "report", label: "Report Item", icon: FilePlus2 },
    { id: "matches", label: "AI Match Hub", icon: GitMerge, badge: "4 matches" },
    { id: "vault", label: "Safe Handoff", icon: ShieldCheck },
    { id: "analytics", label: "Metrics & Logs", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Main Persistent Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between border-r transition-transform duration-200 ease-out md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        darkMode 
          ? "bg-black border-zinc-800 text-zinc-100" 
          : "bg-white border-zinc-200 text-zinc-900"
      }`}>
        
        {/* Top Section: Brand & Navigation */}
        <div className="p-4 space-y-4">
          
          {/* Vercel-Style Brand Header */}
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={() => {
                setActiveTab("feed");
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex items-center space-x-2.5 text-left group focus:outline-none"
            >
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm">
                <Triangle className="w-3.5 h-3.5 fill-black stroke-none" />
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold tracking-tight text-white font-mono">
                  RECOVER<span className="text-zinc-400">-X</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-zinc-900 border border-zinc-800 text-zinc-400">
                  v2.0
                </span>
              </div>
            </button>

            {/* Mobile close X button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-md text-zinc-400 hover:text-white md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Vercel-Style Primary CTA Button */}
          <button
            onClick={() => {
              setActiveTab("report");
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2 px-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Report Lost / Found</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-0.5 pt-1" aria-label="Sidebar Navigation">
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
                  className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? darkMode
                        ? "bg-zinc-900 text-white font-semibold shadow-inner"
                        : "bg-zinc-100 text-black font-semibold"
                      : darkMode
                        ? "text-zinc-400 hover:text-white hover:bg-zinc-900/60"
                        : "text-zinc-600 hover:text-black hover:bg-zinc-100/60"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isActive 
                        ? darkMode ? "bg-zinc-800 text-zinc-200 border border-zinc-700" : "bg-zinc-200 text-zinc-800"
                        : darkMode ? "bg-zinc-900 text-zinc-500" : "bg-zinc-100 text-zinc-500"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Smart Safe Tag Generator Button in Sidebar */}
            <button
              onClick={() => {
                onOpenSmartTag();
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                darkMode ? "text-zinc-400 hover:text-white hover:bg-zinc-900/60" : "text-zinc-600 hover:text-black hover:bg-zinc-100/60"
              }`}
            >
              <QrCode className="w-4 h-4 text-zinc-400" />
              <span>QR Safe-Tags</span>
            </button>
          </nav>
        </div>

        {/* Bottom Utility Controls */}
        <div className={`p-3 border-t space-y-2 ${
          darkMode ? "border-zinc-850 bg-black" : "border-zinc-200 bg-white"
        }`}>
          
          {/* Notifications Drawer Row */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors border ${
                darkMode 
                  ? "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700" 
                  : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bell className="w-3.5 h-3.5 text-zinc-400" />
                <span>Alerts</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-white text-black">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-xl border shadow-2xl p-3 z-50 animate-toast ${
                darkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-semibold text-zinc-200">
                  <span>Match Alerts</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Live</span>
                </div>

                <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onSelectNotification(notif);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        notif.read
                          ? darkMode ? "bg-black border-zinc-850 text-zinc-500" : "bg-zinc-50 border-zinc-200 text-zinc-500"
                          : darkMode ? "bg-zinc-900 border-zinc-750 text-zinc-200" : "bg-zinc-100 border-zinc-300 text-zinc-900"
                      }`}
                    >
                      <div className="font-semibold text-white mb-0.5 flex justify-between">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-zinc-500">{notif.timeAgo}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors ${
              darkMode 
                ? "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900" 
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {darkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-zinc-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-zinc-700" />
                <span>Dark Mode</span>
              </>
            )}
          </button>

        </div>

      </aside>
    </>
  );
}
