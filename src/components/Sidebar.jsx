import React, { useState, useRef, useEffect } from "react";
import { 
  Bell, Plus, Compass, GitMerge, ShieldCheck, 
  BarChart3, Sun, Moon, Check, X, Shield, FilePlus2, QrCode, Sparkles
} from "lucide-react";
import RecoverXLogo from "./RecoverXLogo";

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenSmartTag,
  notifications = [],
  onSelectNotification,
  darkMode,
  onToggleTheme,
  mobileOpen,
  onCloseMobile,
  onReplayIntro
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
    { id: "feed", label: "Campus Explorer", icon: Compass, color: "text-[#4285f4]" },
    { id: "report", label: "Report Lost / Found", icon: FilePlus2, color: "text-[#ea4335]" },
    { id: "matches", label: "AI Match Hub", icon: GitMerge, badge: "4 matches", color: "text-[#34a853]" },
    { id: "vault", label: "Safe Handoff", icon: ShieldCheck, color: "text-[#fbbc04]" },
    { id: "analytics", label: "Campus Metrics", icon: BarChart3, color: "text-[#4285f4]" },
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
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col justify-between border-r transition-transform duration-200 ease-out md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      } ${
        darkMode 
          ? "bg-[#1e1f20] border-[#3c4043] text-[#e8eaed]" 
          : "bg-[#ffffff] border-[#dadce0] text-[#202124]"
      }`}>
        
        {/* Top Section: Brand & Navigation */}
        <div className="p-4 space-y-4">
          
          {/* Custom RECOVER-X Brand Header */}
          <div className="flex items-center justify-between px-1">
            <button 
              onClick={() => {
                setActiveTab("feed");
                if (onCloseMobile) onCloseMobile();
              }}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <RecoverXLogo className="w-9 h-9" />

              <div>
                <div className="flex items-center text-lg font-black tracking-tight">
                  <span className="text-[#4285F4]">R</span>
                  <span className="text-[#EA4335]">E</span>
                  <span className="text-[#FBBC05]">C</span>
                  <span className="text-[#4285F4]">O</span>
                  <span className="text-[#34A853]">V</span>
                  <span className="text-[#EA4335]">E</span>
                  <span className="text-[#4285F4]">R</span>
                  <span className={darkMode ? "text-white" : "text-[#202124]"}>-X</span>
                </div>
                <p className={`text-[11px] font-medium ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
                  Smart Lost & Found
                </p>
              </div>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Google-Style Pill CTA Button (+ Report Item) */}
          <button
            onClick={() => {
              setActiveTab("report");
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2.5 px-4 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all transform hover:shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Report Lost / Found</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1" aria-label="Sidebar Navigation">
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
                  className={`w-full px-3.5 py-2.5 rounded-full text-xs font-medium flex items-center justify-between transition-colors ${
                    isActive
                      ? darkMode
                        ? "bg-[#1a73e8]/20 text-[#8ab4f8] font-bold"
                        : "bg-[#e8f0fe] text-[#1a73e8] font-bold shadow-sm"
                      : darkMode
                        ? "text-[#bdc1c6] hover:bg-[#2d2f31] hover:text-[#ffffff]"
                        : "text-[#3c4043] hover:bg-[#f1f3f4] hover:text-[#202124]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? (darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]") : item.color}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive 
                        ? darkMode ? "bg-[#34a853]/30 text-[#81c995]" : "bg-[#ceead6] text-[#137333]"
                        : darkMode ? "bg-[#2d2f31] text-[#9aa0a6]" : "bg-[#f1f3f4] text-[#5f6368]"
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
              className={`w-full px-3.5 py-2.5 rounded-full text-xs font-medium flex items-center space-x-3 transition-colors ${
                darkMode ? "text-[#fdd663] hover:bg-[#fbbc04]/15" : "text-[#b06000] hover:bg-[#fef7e0]"
              }`}
            >
              <QrCode className="w-4 h-4 text-[#fbbc04]" />
              <span>QR Safe-Tags</span>
            </button>
          </nav>
        </div>

        {/* Bottom Utility Controls */}
        <div className={`p-3 border-t space-y-2 ${
          darkMode ? "border-[#3c4043] bg-[#1e1f20]" : "border-[#dadce0] bg-[#ffffff]"
        }`}>
          
          {/* Notifications Drawer */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-full px-3.5 py-2 rounded-full text-xs font-medium flex items-center justify-between transition-colors border ${
                darkMode 
                  ? "bg-[#2d2f31] border-[#3c4043] text-[#e8eaed] hover:border-[#5f6368]" 
                  : "bg-[#ffffff] border-[#dadce0] text-[#3c4043] hover:border-[#bdc1c6]"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bell className="w-3.5 h-3.5 text-[#4285f4]" />
                <span>Match Alerts</span>
              </div>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ea4335] text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-2xl border shadow-2xl p-3 z-50 animate-toast ${
                darkMode ? "bg-[#2d2f31] border-[#3c4043] text-white" : "bg-white border-[#dadce0] text-[#202124]"
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-[#3c4043] text-xs font-bold">
                  <span className="flex items-center gap-1 text-[#4285f4]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Radar Alerts
                  </span>
                  <span className="text-[10px] text-[#34a853] font-bold">Live AI</span>
                </div>

                <div className="mt-2 space-y-1.5 max-h-56 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onSelectNotification(notif);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        notif.read
                          ? darkMode ? "bg-[#1e1f20] border-[#3c4043] text-[#9aa0a6]" : "bg-[#f8fafd] border-[#dadce0] text-[#5f6368]"
                          : darkMode ? "bg-[#1a73e8]/20 border-[#1a73e8]/40 text-[#e8eaed]" : "bg-[#e8f0fe] border-[#aecbfa] text-[#1a73e8]"
                      }`}
                    >
                      <div className="font-bold mb-0.5 flex justify-between">
                        <span>{notif.title}</span>
                        <span className="text-[10px] text-[#9aa0a6] font-normal">{notif.timeAgo}</span>
                      </div>
                      <p className="text-[11px] line-clamp-2 leading-snug">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Intro Tour Button */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className={`w-full py-2 px-3 rounded-full border text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors ${
                darkMode 
                  ? "bg-[#2d2f31] border-[#3c4043] text-[#8ab4f8] hover:bg-[#3c4043]" 
                  : "bg-white border-[#dadce0] text-[#1a73e8] hover:bg-[#f1f3f4]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>System Boot Intro</span>
            </button>
          )}

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            className={`w-full py-2 px-3 rounded-full border text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors ${
              darkMode 
                ? "bg-[#2d2f31] border-[#3c4043] text-[#e8eaed] hover:bg-[#3c4043]" 
                : "bg-white border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4]"
            }`}
          >
            {darkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#fbbc04]" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[#5f6368]" />
                <span>Dark Theme</span>
              </>
            )}
          </button>

          {/* Google Privacy Badge */}
          <div className="flex items-center justify-center space-x-1 text-[11px] text-[#9aa0a6] py-0.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#4285f4]" />
            <span>Encrypted Campus Privacy</span>
          </div>

        </div>

      </aside>
    </>
  );
}
