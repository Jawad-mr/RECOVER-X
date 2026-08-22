import React, { useState, useEffect } from "react";
import { 
  GitMerge, ShieldCheck, CheckCircle2, 
  MapPin, Clock, Eye, RefreshCw, Check, FileText, ChevronRight, Triangle
} from "lucide-react";
import { runMultimodalMatch } from "../services/geminiService";

export default function MatchHub({ 
  reports, 
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
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (selectedPair?.lost && selectedPair?.found) {
      setCurrentLost(selectedPair.lost);
      setCurrentFound(selectedPair.found);
      handleExecuteMatch(selectedPair.lost, selectedPair.found);
    } else if (lostItems[0] && foundItems[0] && !matchResult) {
      handleExecuteMatch(lostItems[0], foundItems[0]);
    }
  }, [selectedPair]);

  useEffect(() => {
    if (!matchResult) return;
    const target = matchResult.overallScore;
    let current = 0;
    const increment = Math.ceil(target / 20);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [matchResult]);

  const handleExecuteMatch = async (lost, found) => {
    if (!lost || !found) return;
    setIsMatching(true);
    try {
      const result = await runMultimodalMatch(lost, found, "");
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Top Banner & Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-zinc-400" />
            <span>Multi-Signal AI Match Hub</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cross-referencing physical markings, surface damage, and campus geography
          </p>
        </div>

        {/* Featured Matches Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0" role="toolbar" aria-label="Featured Matches">
          <span className="text-xs text-zinc-500 font-mono">Presets:</span>
          {[
            { label: "MacBook", l: "REP-9001", f: "REP-9002" },
            { label: "Hydro Flask", l: "REP-9003", f: "REP-9004" },
            { label: "Sony XM4", l: "REP-9005", f: "REP-9006" },
            { label: "Jansport", l: "REP-9007", f: "REP-9008" }
          ].map((preset) => (
            <button
              key={preset.l}
              onClick={() => selectPresetPair(preset.l, preset.f)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium font-mono transition-colors ${
                currentLost?.id === preset.l
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Left: Lost Item Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-950 border border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
              LOST REPORT
            </span>
            <select
              value={currentLost?.id || ""}
              onChange={(e) => {
                const item = lostItems.find(r => r.id === e.target.value);
                setCurrentLost(item);
                if (item && currentFound) handleExecuteMatch(item, currentFound);
              }}
              className="bg-black border border-zinc-800 rounded-lg text-xs text-zinc-300 px-2 py-1 font-mono"
            >
              {lostItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.title.slice(0, 22)}...
                </option>
              ))}
            </select>
          </div>

          {currentLost && (
            <>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-zinc-800">
                <img 
                  src={currentLost.imageUrl} 
                  alt={currentLost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/90 backdrop-blur-sm border border-zinc-800 text-[11px] text-zinc-300">
                  <span className="text-zinc-400 font-mono">Hallmarks: </span>
                  <span>{currentLost.imageVisualFeatures}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">{currentLost.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{currentLost.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-850 text-zinc-400 font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Location</span>
                  <span className="text-zinc-300 font-sans text-xs">{currentLost.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Reported</span>
                  <span className="text-zinc-300 text-xs">{currentLost.time}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Center: Re-Analyze Trigger */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0">
          <button
            onClick={() => handleExecuteMatch(currentLost, currentFound)}
            disabled={isMatching}
            className="p-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs shadow-sm flex flex-col items-center justify-center gap-1 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
              {isMatching ? "Analyzing" : "Analyze"}
            </span>
          </button>
        </div>

        {/* Right: Found Item Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-950 border border-zinc-800 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              FOUND REPORT
            </span>
            <select
              value={currentFound?.id || ""}
              onChange={(e) => {
                const item = foundItems.find(r => r.id === e.target.value);
                setCurrentFound(item);
                if (currentLost && item) handleExecuteMatch(currentLost, item);
              }}
              className="bg-black border border-zinc-800 rounded-lg text-xs text-zinc-300 px-2 py-1 font-mono"
            >
              {foundItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.title.slice(0, 22)}...
                </option>
              ))}
            </select>
          </div>

          {currentFound && (
            <>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black border border-zinc-800">
                <img 
                  src={currentFound.imageUrl} 
                  alt={currentFound.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/90 backdrop-blur-sm border border-zinc-800 text-[11px] text-zinc-300">
                  <span className="text-zinc-400 font-mono">Hallmarks: </span>
                  <span>{currentFound.imageVisualFeatures}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">{currentFound.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">{currentFound.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-850 text-zinc-400 font-mono">
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Location</span>
                  <span className="text-zinc-300 font-sans text-xs">{currentFound.location}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 block uppercase">Found Time</span>
                  <span className="text-zinc-300 text-xs">{currentFound.time}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MATCH RESULTS BREAKDOWN */}
      {isMatching ? (
        <div className="p-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-2.5 animate-fade-in">
          <RefreshCw className="w-6 h-6 text-zinc-400 animate-spin" />
          <h4 className="text-sm font-semibold text-white">Cross-Referencing Physical & Geospatial Signals</h4>
          <p className="text-xs text-zinc-400 font-mono">Analyzing damage markers, colorimetry, and corridors...</p>
        </div>
      ) : matchResult ? (
        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 space-y-5 animate-score">
          
          {/* Header & Overall Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-850">
            <div className="space-y-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                matchResult.overallScore >= 80 ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-zinc-900 text-zinc-300 border border-zinc-800"
              }`}>
                {matchResult.matchTier.replace("_", " ")}
              </span>
              <h2 className="text-lg font-bold text-white">Evaluation Summary</h2>
            </div>

            {/* Score Ring */}
            <div className="flex items-center space-x-3 bg-black px-4 py-2.5 rounded-xl border border-zinc-800">
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 uppercase font-mono block">Confidence Score</span>
                <span className="text-xs text-zinc-500">Weighted Total</span>
              </div>
              <div className="text-3xl font-bold font-mono text-white">
                {displayScore}%
              </div>
            </div>
          </div>

          {/* Rationale */}
          <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1 text-xs">
            <span className="text-zinc-400 font-semibold uppercase text-[10px] font-mono block">Rationale:</span>
            <p className="text-zinc-200 leading-relaxed">
              "{matchResult.summaryReason}"
            </p>
          </div>

          {/* 4-SIGNAL BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Visual Surface Match (40%)", data: matchResult.breakdown.visualSimilarity },
              { label: "Model & Specs (25%)", data: matchResult.breakdown.descriptionSimilarity },
              { label: "Campus Proximity (20%)", data: matchResult.breakdown.locationProximity },
              { label: "Timeline Delta (15%)", data: matchResult.breakdown.timeProximity }
            ].map((sig, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-black border border-zinc-850 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{sig.label}</span>
                  <span className="font-mono font-bold text-white text-xs">{sig.data.score}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${sig.data.score}%` }}></div>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{sig.data.details}</p>
              </div>
            ))}
          </div>

          {/* Key Visual Evidence Chips */}
          {matchResult.keyVisualEvidence && matchResult.keyVisualEvidence.length > 0 && (
            <div className="p-3.5 rounded-xl bg-black border border-zinc-850 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 block">
                Corroborated Evidence:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.keyVisualEvidence.map((ev, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
            <span className="text-xs text-zinc-400">Ready to initiate ownership challenge?</span>
            <button
              onClick={() => onStartClaimVerification(currentFound || currentLost)}
              className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Verify Ownership & Claim</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      ) : null}

    </div>
  );
}
