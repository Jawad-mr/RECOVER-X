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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#3c4043]">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#4285F4]/20 text-[#8ab4f8]">
            <MapPin className="w-5 h-5 text-[#4285F4]" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-white">
              Campus Hotspots & Safe Kiosks
            </h2>
            <p className="text-xs text-[#9aa0a6]">
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
                  ? "bg-[#1a73e8]/20 border-[#8ab4f8] ring-2 ring-[#8ab4f8] shadow-md"
                  : "bg-[#2d2f31] border-[#3c4043] hover:border-[#5f6368]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl bg-[#1e1f20] border border-[#3c4043] ${zone.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e1f20] text-[#bdc1c6] border border-[#3c4043]">
                  {zone.area}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{zone.name}</h4>
                <p className="text-[11px] text-[#9aa0a6] mt-0.5">
                  {zone.kiosk}
                </p>
              </div>

              <div className="pt-2 border-t border-[#3c4043] flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2">
                  <span className="text-[#f28b82]">{zone.lost} lost</span>
                  <span className="text-[#5f6368]">•</span>
                  <span className="text-[#81c995]">{zone.found} found</span>
                </div>
                <span className="text-[#8ab4f8] text-[11px]">
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
