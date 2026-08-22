import React from "react";
import { 
  BarChart3, ShieldCheck, Zap, Clock, MapPin, 
  Sparkles, CheckCircle2, TrendingUp, AlertTriangle, Users
} from "lucide-react";
import { SAFE_HANDOFF_ZONES } from "../data/seedData";

export default function AnalyticsView({ reports, darkMode = true }) {
  const lostCount = reports.filter(r => r.type === "lost").length;
  const foundCount = reports.filter(r => r.type === "found").length;
  const total = reports.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className={`pb-4 border-b ${darkMode ? "border-[#3c4043]" : "border-[#dadce0]"}`}>
        <div className="flex items-center space-x-2.5">
          <div className={`p-2 rounded-xl ${
            darkMode ? "bg-[#4285F4]/20 text-[#8ab4f8]" : "bg-[#e8f0fe] text-[#1a73e8]"
          }`}>
            <BarChart3 className="w-5 h-5 text-[#4285F4]" />
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${
            darkMode ? "text-white" : "text-[#202124]"
          }`}>
            Campus Trust & Recovery Intelligence
          </h1>
        </div>
        <p className={`mt-1 text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
          Real-time analytics on multimodal AI matching efficiency, fraud interception, and campus safe zone throughput.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-5 rounded-3xl border space-y-2 shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
          <div className={`flex items-center justify-between text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
            <span className="font-medium">AI Match Precision</span>
            <Sparkles className="w-4 h-4 text-[#4285F4]" />
          </div>
          <div className={`text-3xl font-black ${darkMode ? "text-white" : "text-[#202124]"}`}>96.4%</div>
          <div className={`text-[11px] font-bold flex items-center gap-1 ${
            darkMode ? "text-[#81c995]" : "text-[#137333]"
          }`}>
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multimodal Vision + Text</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border space-y-2 shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
          <div className={`flex items-center justify-between text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
            <span className="font-medium">Fraud Interception</span>
            <ShieldCheck className="w-4 h-4 text-[#EA4335]" />
          </div>
          <div className={`text-3xl font-black ${darkMode ? "text-white" : "text-[#202124]"}`}>100%</div>
          <div className={`text-[11px] font-bold ${
            darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"
          }`}>
            <span>Zero False Claims Released</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border space-y-2 shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
          <div className={`flex items-center justify-between text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
            <span className="font-medium">Recovery Delta</span>
            <Clock className="w-4 h-4 text-[#FBBC05]" />
          </div>
          <div className={`text-3xl font-black ${darkMode ? "text-white" : "text-[#202124]"}`}>1.8 hrs</div>
          <div className={`text-[11px] font-bold ${
            darkMode ? "text-[#fdd663]" : "text-[#b06000]"
          }`}>
            <span>Proactive Push Speed</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border space-y-2 shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
          <div className={`flex items-center justify-between text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
            <span className="font-medium">Campus Reports</span>
            <Users className="w-4 h-4 text-[#34A853]" />
          </div>
          <div className={`text-3xl font-black ${darkMode ? "text-white" : "text-[#202124]"}`}>{total} Items</div>
          <div className={`text-[11px] font-bold ${darkMode ? "text-[#bdc1c6]" : "text-[#5f6368]"}`}>
            <span className={darkMode ? "text-[#f28b82]" : "text-[#c5221f]"}>{lostCount} Lost</span> • <span className={darkMode ? "text-[#81c995]" : "text-[#137333]"}>{foundCount} Found</span>
          </div>
        </div>

      </div>

      {/* Building Hotspots & Multi-Signal Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Campus Hotspots Heatmap */}
        <div className={`lg:col-span-7 rounded-3xl border p-6 space-y-4 shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
            darkMode ? "text-white" : "text-[#202124]"
          }`}>
            <MapPin className="w-4 h-4 text-[#EA4335]" />
            <span>Campus Activity Hotspots</span>
          </h3>

          <div className="space-y-3 pt-1">
            {[
              { building: "Central Library (Study Rooms & Atrium)", count: 4, pct: 45, color: "bg-[#4285F4]" },
              { building: "Science & Engineering Complex", count: 2, pct: 25, color: "bg-[#34A853]" },
              { building: "Athletics & Recreation Center", count: 2, pct: 20, color: "bg-[#FBBC05]" },
              { building: "Student Union Lounge & Cafe", count: 1, pct: 10, color: "bg-[#EA4335]" }
            ].map((spot, i) => (
              <div key={i} className={`p-3 rounded-2xl border space-y-1.5 ${
                darkMode ? "bg-[#2d2f31] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>{spot.building}</span>
                  <span className={`font-mono ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>{spot.count} items ({spot.pct}%)</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  darkMode ? "bg-[#1e1f20]" : "bg-[#e8eaed]"
                }`}>
                  <div className={`${spot.color} h-full rounded-full`} style={{ width: `${spot.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Multimodal Signal Distribution */}
        <div className={`lg:col-span-5 rounded-3xl border p-6 space-y-4 shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
          <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
            darkMode ? "text-white" : "text-[#202124]"
          }`}>
            <Zap className="w-4 h-4 text-[#FBBC05]" />
            <span>AI Reasoning Signal Weights</span>
          </h3>

          <div className={`p-4 rounded-2xl border space-y-3 text-xs ${
            darkMode ? "bg-[#2d2f31] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold ${darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"}`}>1. Visual Surface & Markings</span>
              <span className={`font-mono font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>40%</span>
            </div>
            <p className={`text-[11px] leading-snug ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
              Visual AI inspection of scratches, decals, dents, and colorimetry.
            </p>

            <div className={`pt-2 border-t flex items-center justify-between ${
              darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
            }`}>
              <span className={`font-bold ${darkMode ? "text-[#81c995]" : "text-[#137333]"}`}>2. Model & Specs</span>
              <span className={`font-mono font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>25%</span>
            </div>

            <div className={`pt-2 border-t flex items-center justify-between ${
              darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
            }`}>
              <span className={`font-bold ${darkMode ? "text-[#fdd663]" : "text-[#b06000]"}`}>3. Campus Proximity</span>
              <span className={`font-mono font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>20%</span>
            </div>

            <div className={`pt-2 border-t flex items-center justify-between ${
              darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
            }`}>
              <span className={`font-bold ${darkMode ? "text-[#f28b82]" : "text-[#c5221f]"}`}>4. Timeline Delta</span>
              <span className={`font-mono font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>15%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Supervised Safe Handoff Network Status */}
      <div className={`rounded-3xl border p-6 space-y-4 shadow-md ${
        darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
      }`}>
        <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
          darkMode ? "text-white" : "text-[#202124]"
        }`}>
          <ShieldCheck className="w-4 h-4 text-[#34A853]" />
          <span>Active Supervised Safe Handoff Stations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAFE_HANDOFF_ZONES.map((zone) => (
            <div key={zone.id} className={`p-4 rounded-2xl border space-y-2 ${
              darkMode ? "bg-[#2d2f31] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold text-xs ${darkMode ? "text-white" : "text-[#202124]"}`}>{zone.name}</span>
                <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
              </div>
              <p className={`text-[11px] ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>{zone.location}</p>
              <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${
                darkMode ? "border-[#3c4043] text-[#bdc1c6]" : "border-[#dadce0] text-[#5f6368]"
              }`}>
                <span>{zone.hours}</span>
                <span className={`font-bold ${darkMode ? "text-[#81c995]" : "text-[#137333]"}`}>Station Online</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
