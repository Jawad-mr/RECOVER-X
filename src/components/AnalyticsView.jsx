import React from "react";
import { 
  BarChart3, ShieldCheck, Zap, Clock, MapPin, 
  Sparkles, CheckCircle2, TrendingUp, AlertTriangle, Users
} from "lucide-react";
import { SAFE_HANDOFF_ZONES } from "../data/seedData";

export default function AnalyticsView({ reports }) {
  const lostCount = reports.filter(r => r.type === "lost").length;
  const foundCount = reports.filter(r => r.type === "found").length;
  const total = reports.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Trust & Recovery Intelligence
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          Real-time analytics on multimodal AI matching efficiency, fraud interception, and campus safe zone throughput.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Match Precision</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">96.4%</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Multimodal Vision + Text</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Fraud Interception Rate</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">100%</div>
          <div className="text-[11px] text-cyan-400">
            <span>Zero False Claims Released</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Recovery Delta</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">1.8 hrs</div>
          <div className="text-[11px] text-amber-400">
            <span>Proactive Push Speed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Campus Reports</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{total} Items</div>
          <div className="text-[11px] text-purple-400">
            <span>{lostCount} Lost • {foundCount} Found</span>
          </div>
        </div>

      </div>

      {/* Building Hotspots & Multi-Signal Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Campus Hotspots Heatmap */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-400" />
            <span>Campus Building Activity Hotspots</span>
          </h3>

          <div className="space-y-3 pt-2">
            {[
              { building: "Central Library (Study Rooms & Atrium)", count: 4, pct: 45, color: "bg-emerald-500" },
              { building: "Science & Engineering Complex", count: 2, pct: 25, color: "bg-cyan-500" },
              { building: "Athletics & Recreation Center", count: 2, pct: 20, color: "bg-amber-500" },
              { building: "Student Union Lounge & Cafe", count: 1, pct: 10, color: "bg-purple-500" }
            ].map((spot, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{spot.building}</span>
                  <span className="text-slate-400 font-mono">{spot.count} items ({spot.pct}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`${spot.color} h-full rounded-full`} style={{ width: `${spot.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Multimodal Signal Distribution */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>AI Reasoning Signal Weights</span>
          </h3>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold">1. Visual Surface & Markings</span>
              <span className="font-mono font-bold text-white">40% Weight</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Visual AI inspection of scratches, decals, dents, and colorimetry.
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-cyan-400 font-bold">2. Model & Categorical Specs</span>
              <span className="font-mono font-bold text-white">25% Weight</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-amber-400 font-bold">3. Campus Geospatial Proximity</span>
              <span className="font-mono font-bold text-white">20% Weight</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-purple-400 font-bold">4. Temporal Coincidence Delta</span>
              <span className="font-mono font-bold text-white">15% Weight</span>
            </div>
          </div>
        </div>

      </div>

      {/* Supervised Safe Handoff Network Status */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Active Supervised Safe Handoff Stations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAFE_HANDOFF_ZONES.map((zone) => (
            <div key={zone.id} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{zone.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-[11px] text-slate-400">{zone.location}</p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>{zone.hours}</span>
                <span className="text-emerald-400 font-medium">Station Online</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
