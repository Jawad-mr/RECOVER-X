import React, { useState, useEffect } from "react";
import { 
  Sparkles, GitMerge, ArrowRight, ShieldCheck, CheckCircle2, 
  MapPin, Clock, Eye, AlertTriangle, Cpu, Layers, RefreshCw,
  QrCode, ArrowLeftRight, Check, ShieldAlert, FileText, ChevronRight
} from "lucide-react";
import { runMultimodalMatch } from "../services/geminiService";

export default function MatchHub({ 
  reports, 
  apiKey, 
  selectedPair, 
  onSelectPair,
  onStartClaimVerification,
  onOpenHandoff
}) {
  const lostItems = reports.filter(r => r.type === "lost");
  const foundItems = reports.filter(r => r.type === "found");

  const [currentLost, setCurrentLost] = useState(lostItems[0] || null);
  const [currentFound, setCurrentFound] = useState(foundItems[0] || null);
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // Sync with selected pair if passed from outside
  useEffect(() => {
    if (selectedPair?.lost && selectedPair?.found) {
      setCurrentLost(selectedPair.lost);
      setCurrentFound(selectedPair.found);
      handleExecuteMatch(selectedPair.lost, selectedPair.found);
    } else if (lostItems[0] && foundItems[0] && !matchResult) {
      handleExecuteMatch(lostItems[0], foundItems[0]);
    }
  }, [selectedPair]);

  const handleExecuteMatch = async (lost, found) => {
    if (!lost || !found) return;
    setIsMatching(true);
    try {
      const result = await runMultimodalMatch(lost, found, apiKey);
      setMatchResult(result);
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setIsMatching(false);
    }
  };

  const selectPresetPair = (lostId, foundId) => {
    const l = reports.find(r => r.id === lostId);
    const f = reports.find(r => r.id === foundId);
    if (l && f) {
      setCurrentLost(l);
      setCurrentFound(f);
      handleExecuteMatch(l, f);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner & Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <GitMerge className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Multimodal AI Reasoning Hub
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Real Gemini Vision + Text matching across visual indicators, damage hallmarks, and campus geospatial proximity.
          </p>
        </div>

        {/* Quick Test Pair Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Judge Presets:</span>
          <button
            onClick={() => selectPresetPair("REP-9001", "REP-9002")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentLost?.id === "REP-9001" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            💻 MacBook Pro
          </button>
          <button
            onClick={() => selectPresetPair("REP-9003", "REP-9004")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentLost?.id === "REP-9003" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            💧 Hydro Flask
          </button>
          <button
            onClick={() => selectPresetPair("REP-9005", "REP-9006")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentLost?.id === "REP-9005" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🎧 Sony XM4
          </button>
          <button
            onClick={() => selectPresetPair("REP-9007", "REP-9008")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentLost?.id === "REP-9007" 
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🎒 Jansport Fox
          </button>
        </div>
      </div>

      {/* Side-by-Side Multimodal Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Lost Item Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-rose-900/40 overflow-hidden shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              Report #1: Lost Report
            </span>
            <select
              value={currentLost?.id || ""}
              onChange={(e) => {
                const item = lostItems.find(r => r.id === e.target.value);
                setCurrentLost(item);
                if (item && currentFound) handleExecuteMatch(item, currentFound);
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1 focus:outline-none focus:border-rose-500"
            >
              {lostItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>

          {currentLost && (
            <>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img 
                  src={currentLost.imageUrl} 
                  alt={currentLost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-semibold">Visual Signature: </span>
                  {currentLost.imageVisualFeatures}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{currentLost.title}</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">{currentLost.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-400">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Lost Location</span>
                  <span className="text-slate-200 font-medium">{currentLost.location}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Reported Timestamp</span>
                  <span className="text-slate-200 font-medium">{currentLost.date} @ {currentLost.time}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Center: AI Multimodal Processing Core */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
          <button
            onClick={() => handleExecuteMatch(currentLost, currentFound)}
            disabled={isMatching}
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 font-black shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 group"
          >
            <Sparkles className={`w-7 h-7 stroke-[2.5] ${isMatching ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
            <span className="text-[11px] uppercase tracking-wider font-extrabold">
              {isMatching ? "Reasoning..." : "Re-Match AI"}
            </span>
          </button>
          <span className="text-[10px] text-slate-400 mt-2 font-mono text-center">
            Gemini Multimodal Reasoning
          </span>
        </div>

        {/* Right: Found Item Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/90 border border-emerald-900/40 overflow-hidden shadow-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Report #2: Found Report
            </span>
            <select
              value={currentFound?.id || ""}
              onChange={(e) => {
                const item = foundItems.find(r => r.id === e.target.value);
                setCurrentFound(item);
                if (currentLost && item) handleExecuteMatch(currentLost, item);
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 px-2.5 py-1 focus:outline-none focus:border-emerald-500"
            >
              {foundItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.title.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>

          {currentFound && (
            <>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img 
                  src={currentFound.imageUrl} 
                  alt={currentFound.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-semibold">Visual Signature: </span>
                  {currentFound.imageVisualFeatures}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{currentFound.title}</h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">{currentFound.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-400">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Found Location</span>
                  <span className="text-slate-200 font-medium">{currentFound.location}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-slate-500 block">Found Timestamp</span>
                  <span className="text-slate-200 font-medium">{currentFound.date} @ {currentFound.time}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MATCH RESULTS: EXPLAINABLE WEIGHTED CONFIDENCE BREAKDOWN */}
      {isMatching ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-spin">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Cross-Referencing Physical & Geospatial Markers</h4>
            <p className="text-xs text-slate-400 mt-1">Executing Gemini Multimodal Vision Prompt across color, damage, decals, and campus corridors...</p>
          </div>
        </div>
      ) : matchResult ? (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
          
          {/* Header & Overall Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  matchResult.overallScore >= 80
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : matchResult.overallScore >= 60
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}>
                  {matchResult.matchTier.replace("_", " ")}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Engine: {matchResult.source || "Gemini Multimodal"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Multimodal Forensic Assessment
              </h2>
            </div>

            {/* Score Ring / Gauge */}
            <div className="flex items-center space-x-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Overall Match Confidence</span>
                <span className="text-xs text-slate-500">Weighted Cross-Modal Score</span>
              </div>
              <div className={`text-4xl font-black ${
                matchResult.overallScore >= 80 ? "text-emerald-400" : matchResult.overallScore >= 60 ? "text-amber-400" : "text-slate-400"
              }`}>
                {matchResult.overallScore}%
              </div>
            </div>
          </div>

          {/* Plain-Language Forensic Rationale */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>AI Forensic Rationale</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed font-normal">
              "{matchResult.summaryReason}"
            </p>
          </div>

          {/* 4-SIGNAL WEIGHTED BREAKDOWN */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Weighted Multi-Signal Breakdown (Explainable Reasoning)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Signal 1: Visual Similarity (40% Weight) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    Visual Similarity (40% Weight)
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {matchResult.breakdown.visualSimilarity.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${matchResult.breakdown.visualSimilarity.score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {matchResult.breakdown.visualSimilarity.details}
                </p>
              </div>

              {/* Signal 2: Description Similarity (25% Weight) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Description & Specs (25% Weight)
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    {matchResult.breakdown.descriptionSimilarity.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${matchResult.breakdown.descriptionSimilarity.score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {matchResult.breakdown.descriptionSimilarity.details}
                </p>
              </div>

              {/* Signal 3: Location Proximity (20% Weight) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Geospatial Proximity (20% Weight)
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {matchResult.breakdown.locationProximity.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${matchResult.breakdown.locationProximity.score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {matchResult.breakdown.locationProximity.details}
                </p>
              </div>

              {/* Signal 4: Time Proximity (15% Weight) */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Temporal Delta (15% Weight)
                  </span>
                  <span className="font-mono font-bold text-purple-400">
                    {matchResult.breakdown.timeProximity.score}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${matchResult.breakdown.timeProximity.score}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {matchResult.breakdown.timeProximity.details}
                </p>
              </div>

            </div>
          </div>

          {/* Key Visual Evidence Chips */}
          {matchResult.keyVisualEvidence && matchResult.keyVisualEvidence.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Corroborated Visual Markers & Physical Evidence:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {matchResult.keyVisualEvidence.map((ev, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-medium flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* NEXT STEPS: ANTI-FRAUD CLAIM & SAFE HANDOFF */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              <span className="text-slate-300 font-semibold block">Next Step in Pipeline:</span>
              <span>Run anti-fraud verification before releasing handoff QR code.</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => onStartClaimVerification(currentFound || currentLost)}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Launch Anti-Fraud Verification</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
