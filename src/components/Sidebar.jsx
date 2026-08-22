import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Bell, Plus, Compass, GitMerge, ShieldCheck, 
  BarChart3, Sun, Moon, Check, X, Shield, FilePlus2, QrCode
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
    { id: "feed", label: "Campus Explorer", icon: Compass },
    { id: "report", label: "Report Lost / Found", icon: FilePlus2 },
    { id: "matches", label: "AI Match Hub", icon: GitMerge, badge: "4 matches" },
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
        
        {/* Top Section: Brand & Navigation */}
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
                  <span className="text-xl font-black tracking-tight text-white">
                    RECOVER<span className="text-emerald-500">-X</span>
                  </span>
                </div>
                <p className={`text-[11px] font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Smart Lost & Found
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

          {/* Primary Action Button: Report Item */}
          <button
            onClick={() => {
              setActiveTab("report");
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Report Item</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-1" aria-label="Sidebar Navigation">
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

            {/* Smart Safe Tag Generator Button in Sidebar */}
            <button
              onClick={() => {
                onOpenSmartTag();
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-3 transition-colors ${
                darkMode ? "text-purple-400 hover:bg-purple-950/40 border border-purple-800/50" : "text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200"
              }`}
            >
              <QrCode className="w-4 h-4 text-purple-400" />
              <span>QR Safe-Tag Generator</span>
            </button>
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
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors border ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700" 
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Bell className="w-4 h-4 text-emerald-500" />
                <span>Match Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-emerald-500 text-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-2xl border shadow-2xl p-4 z-50 animate-toast ${
                darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Match Alerts
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-bold">Real-time</span>
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

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-colors ${
              darkMode 
                ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800" 
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span>Switch to Dark Theme</span>
              </>
            )}
          </button>

          {/* Security & Privacy Badge */}
          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 py-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Encrypted Privacy Protection</span>
          </div>

        </div>

      </aside>
    </>
  );
}
