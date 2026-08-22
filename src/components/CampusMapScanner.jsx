import React, { useState } from "react";
import { 
  MapPin, Compass, Building, ShieldCheck, 
  Layers, ArrowRight, Sparkles, Filter
} from "lucide-react";
import { CAMPUS_LOCATIONS } from "../data/seedData";

export default function CampusMapScanner({ 
  reports, 
  onSelectLocationFilter, 
  selectedLocation,
  darkMode 
}) {
  const [hoveredZone, setHoveredZone] = useState(null);

  const zoneStats = [
    {
      id: "loc-1",
      name: "Central Library",
      area: "North Quad",
      icon: "📚",
      lost: reports.filter(r => r.location.includes("Library") && r.type === "lost").length,
      found: reports.filter(r => r.location.includes("Library") && r.type === "found").length,
      kiosk: "Kiosk #1 • Level 1 Desk"
    },
    {
      id: "loc-2",
      name: "Science Complex",
      area: "East Wing",
      icon: "🔬",
      lost: reports.filter(r => r.location.includes("Science") && r.type === "lost").length,
      found: reports.filter(r => r.location.includes("Science") && r.type === "found").length,
      kiosk: "Kiosk #2 • Lab Lobby"
    },
    {
      id: "loc-3",
      name: "Athletics Center",
      area: "South Quad",
      icon: "🏀",
      lost: reports.filter(r => (r.location.includes("Athletics") || r.location.includes("Gym")) && r.type === "lost").length,
      found: reports.filter(r => (r.location.includes("Athletics") || r.location.includes("Gym")) && r.type === "found").length,
      kiosk: "Kiosk #3 • Gym Desk"
    },
    {
      id: "loc-4",
      name: "Student Union",
      area: "West Plaza",
      icon: "☕",
      lost: reports.filter(r => (r.location.includes("Union") || r.location.includes("Dining")) && r.type === "lost").length,
      found: reports.filter(r => (r.location.includes("Union") || r.location.includes("Dining")) && r.type === "found").length,
      kiosk: "Kiosk #4 • Info Desk"
    }
  ];

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 ${
      darkMode ? "bg-zinc-950/80 border-zinc-800" : "bg-white border-zinc-200"
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-850">
        <div>
          <h2 className="text-base font-bold tracking-tight text-white">
            Campus Hotspots & Safe Kiosks
          </h2>
          <p className="text-xs text-zinc-400">
            Click any zone to filter reported items by building location
          </p>
        </div>

        {selectedLocation && (
          <button
            onClick={() => onSelectLocationFilter(null)}
            className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-750 text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors self-start"
          >
            <span>Zone: <strong>{selectedLocation}</strong></span>
            <span className="text-rose-400 font-mono ml-1">✕</span>
          </button>
        )}
      </div>

      {/* Grid of Building Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {zoneStats.map((zone) => {
          const isSelected = selectedLocation === zone.name;
          return (
            <button
              key={zone.id}
              onClick={() => onSelectLocationFilter(isSelected ? null : zone.name)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-colors ${
                isSelected
                  ? "bg-zinc-900 border-white ring-1 ring-white shadow-sm"
                  : darkMode ? "bg-black/60 border-zinc-850 hover:border-zinc-700" : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xl p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">{zone.icon}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
                  {zone.area}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white">{zone.name}</h4>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  {zone.kiosk}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-850 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-rose-400 font-medium">{zone.lost} lost</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-emerald-400 font-medium">{zone.found} found</span>
                </div>
                <span className="text-[10px] font-semibold text-zinc-400">
                  {isSelected ? "Active" : "Select"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
}
