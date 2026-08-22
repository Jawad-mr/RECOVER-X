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

  // Group counts by location
  const zoneStats = [
    {
      id: "loc-1",
      name: "Central Library",
      area: "North Quad",
      icon: "📚",
      lost: reports.filter(r => r.location.includes("Library") && r.type === "lost").length,
      found: reports.filter(r => r.location.includes("Library") && r.type === "found").length,
      kiosk: "Safe Drop Kiosk #1 (Level 1 Front Desk)",
      coords: { top: "25%", left: "45%" },
      accent: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/40"
    },
    {
      id: "loc-2",
      name: "Science Complex",
      area: "East Wing",
      icon: "🔬",
      lost: reports.filter(r => r.location.includes("Science") && r.type === "lost").length,
      found: reports.filter(r => r.location.includes("Science") && r.type === "found").length,
      kiosk: "Safe Drop Kiosk #2 (Lab Lobby)",
      coords: { top: "35%", left: "75%" },
      accent: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/40"
    },
    {
      id: "loc-3",
      name: "Athletics Center",
      area: "South Quad",
      icon: "🏀",
      lost: reports.filter(r => (r.location.includes("Athletics") || r.location.includes("Gym")) && r.type === "lost").length,
      found: reports.filter(r => (r.location.includes("Athletics") || r.location.includes("Gym")) && r.type === "found").length,
      kiosk: "Safe Drop Kiosk #3 (Gymnasium Desk)",
      coords: { top: "70%", left: "30%" },
      accent: "from-amber-500/20 to-amber-500/5 border-amber-500/40"
    },
    {
      id: "loc-4",
      name: "Student Union",
      area: "West Plaza",
      icon: "☕",
      lost: reports.filter(r => (r.location.includes("Union") || r.location.includes("Dining")) && r.type === "lost").length,
      found: reports.filter(r => (r.location.includes("Union") || r.location.includes("Dining")) && r.type === "found").length,
      kiosk: "Safe Drop Kiosk #4 (Information Desk)",
      coords: { top: "60%", left: "65%" },
      accent: "from-purple-500/20 to-purple-500/5 border-purple-500/40"
    }
  ];

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
      darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    }`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Interactive Campus Hotspots & Safe Zones
            </h2>
          </div>
          <p className={`text-xs mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Live geospatial distribution of lost and recovered gear across campus safe drop kiosks
          </p>
        </div>

        {selectedLocation && (
          <button
            onClick={() => onSelectLocationFilter(null)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors self-start"
          >
            <span>Filtering: <strong>{selectedLocation}</strong></span>
            <span className="text-rose-400 font-bold ml-1">✕ Clear</span>
          </button>
        )}
      </div>

      {/* Grid of Interactive Building Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {zoneStats.map((zone) => {
          const isSelected = selectedLocation === zone.name;
          const totalItems = zone.lost + zone.found;
          return (
            <button
              key={zone.id}
              onClick={() => onSelectLocationFilter(isSelected ? null : zone.name)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between space-y-3 transition-all transform hover:-translate-y-1 ${
                isSelected
                  ? "bg-emerald-950/70 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg"
                  : darkMode ? "bg-slate-950/80 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">{zone.icon}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-800 text-slate-300">
                  {zone.area}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-extrabold">{zone.name}</h4>
                <p className={`text-[11px] font-medium mt-0.5 line-clamp-1 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}>
                  {zone.kiosk}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-rose-400 font-bold font-mono">{zone.lost} Lost</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 font-bold font-mono">{zone.found} Found</span>
                </div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 hover:underline">
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
