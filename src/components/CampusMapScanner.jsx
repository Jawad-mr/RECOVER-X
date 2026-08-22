import React, { useState } from "react";
import { 
  MapPin, Compass, Building, ShieldCheck, 
  Layers, ArrowRight, Sparkles, Filter,
  BookOpen, FlaskConical, Trophy, Coffee, X
} from "lucide-react";
import { CAMPUS_LOCATIONS } from "../data/seedData";

export default function CampusMapScanner({ 
  reports, 
  onSelectLocationFilter, 
  selectedLocation,
  darkMode 
}) {
  const zoneStats = [
    {
      id: "loc-1",
      name: "Central Library",
      area: "North Quad",
      icon: BookOpen,
      iconColor: "text-[#4285F4]",
      lost: reports.filter(r => r.location.includes("Library") && r.type === "lost").length,
      found: reports.filter(r => r.location.includes("Library") && r.type === "found").length,
      kiosk: "Kiosk #1 • Level 1 Front Desk"
    },
    {
      id: "loc-2",
      name: "Science Complex",
      area: "East Wing",
      icon: FlaskConical,
      iconColor: "text-[#34A853]",
      lost: reports.filter(r => r.location.includes("Science") && r.type === "lost").length,
      found: reports.filter(r => r.location.includes("Science") && r.type === "found").length,
      kiosk: "Kiosk #2 • Lab Lobby"
    },
    {
      id: "loc-3",
      name: "Athletics Center",
      area: "South Quad",
      icon: Trophy,
      iconColor: "text-[#FBBC05]",
      lost: reports.filter(r => (r.location.includes("Athletics") || r.location.includes("Gym")) && r.type === "lost").length,
      found: reports.filter(r => (r.location.includes("Athletics") || r.location.includes("Gym")) && r.type === "found").length,
      kiosk: "Kiosk #3 • Gymnasium Desk"
    },
    {
      id: "loc-4",
      name: "Student Union",
      area: "West Plaza",
      icon: Coffee,
      iconColor: "text-[#EA4335]",
      lost: reports.filter(r => (r.location.includes("Union") || r.location.includes("Dining")) && r.type === "lost").length,
      found: reports.filter(r => (r.location.includes("Union") || r.location.includes("Dining")) && r.type === "found").length,
      kiosk: "Kiosk #4 • Info Lounge"
    }
  ];

  return (
    <div className={`p-6 rounded-3xl border space-y-4 shadow-md ${
      darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
    }`}>
      
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
        darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl ${
            darkMode ? "bg-[#4285F4]/20 text-[#8ab4f8]" : "bg-[#e8f0fe] text-[#1a73e8]"
          }`}>
            <MapPin className="w-5 h-5 text-[#4285F4]" />
          </div>
          <div>
            <h2 className={`text-base font-bold tracking-tight ${
              darkMode ? "text-white" : "text-[#202124]"
            }`}>
              Campus Hotspots & Safe Kiosks
            </h2>
            <p className={`text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
              Filter lost and found reports by campus facility
            </p>
          </div>
        </div>

        {selectedLocation && (
          <button
            onClick={() => onSelectLocationFilter(null)}
            className="px-3.5 py-1.5 rounded-full bg-[#1a73e8] text-xs font-bold text-white flex items-center gap-1.5 shadow-sm self-start"
          >
            <span>Zone: {selectedLocation}</span>
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>

      {/* Grid of Building Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {zoneStats.map((zone) => {
          const Icon = zone.icon;
          const isSelected = selectedLocation === zone.name;
          return (
            <button
              key={zone.id}
              onClick={() => onSelectLocationFilter(isSelected ? null : zone.name)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all ${
                isSelected
                  ? darkMode 
                    ? "bg-[#1a73e8]/20 border-[#8ab4f8] ring-2 ring-[#8ab4f8] shadow-md"
                    : "bg-[#e8f0fe] border-[#1a73e8] ring-2 ring-[#1a73e8] shadow-md"
                  : darkMode
                    ? "bg-[#2d2f31] border-[#3c4043] hover:border-[#5f6368]"
                    : "bg-[#f8fafd] border-[#dadce0] hover:border-[#bdc1c6]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl border ${
                  darkMode ? "bg-[#1e1f20] border-[#3c4043]" : "bg-white border-[#dadce0] shadow-sm"
                } ${zone.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  darkMode ? "bg-[#1e1f20] text-[#bdc1c6] border-[#3c4043]" : "bg-white text-[#5f6368] border-[#dadce0]"
                }`}>
                  {zone.area}
                </span>
              </div>

              <div>
                <h4 className={`text-sm font-bold ${
                  darkMode ? "text-white" : "text-[#202124]"
                }`}>{zone.name}</h4>
                <p className={`text-[11px] mt-0.5 ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
                  {zone.kiosk}
                </p>
              </div>

              <div className={`pt-2 border-t flex items-center justify-between text-xs font-bold ${
                darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
              }`}>
                <div className="flex items-center space-x-2">
                  <span className={darkMode ? "text-[#f28b82]" : "text-[#c5221f]"}>{zone.lost} lost</span>
                  <span className={darkMode ? "text-[#5f6368]" : "text-[#bdc1c6]"}>•</span>
                  <span className={darkMode ? "text-[#81c995]" : "text-[#137333]"}>{zone.found} found</span>
                </div>
                <span className={`text-[11px] ${
                  isSelected 
                    ? darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]" 
                    : darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"
                }`}>
                  {isSelected ? "Active" : "Filter"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
