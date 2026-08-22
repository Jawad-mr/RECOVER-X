import React, { useState, useEffect } from "react";
import { 
  GitMerge, ShieldCheck, CheckCircle2, 
  MapPin, Clock, Eye, RefreshCw, Check, FileText, ChevronRight, Sparkles,
  Laptop, Droplets, Headphones, Backpack
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3c4043]">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#4285F4]/20 text-[#8ab4f8]">
              <GitMerge className="w-5 h-5 text-[#4285F4]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              AI Multi-Signal Match Hub
            </h1>
          </div>
          <p className="text-xs text-[#9aa0a6] mt-1">
            Multimodal vision and text analysis cross-referencing physical markings, surface damage, and campus corridors
          </p>
        </div>

        {/* Featured Matches Switcher with Lucide Icons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" role="toolbar" aria-label="Featured Matches">
          <span className="text-xs text-[#9aa0a6] font-bold">Featured:</span>
          {[
            { label: "MacBook Pro", icon: Laptop, l: "REP-9001", f: "REP-9002" },
            { label: "Hydro Flask", icon: Droplets, l: "REP-9003", f: "REP-9004" },
            { label: "Sony XM4", icon: Headphones, l: "REP-9005", f: "REP-9006" },
            { label: "Jansport Fox", icon: Backpack, l: "REP-9007", f: "REP-9008" }
          ].map((preset) => {
            const Icon = preset.icon;
            const isSelected = currentLost?.id === preset.l;
            return (
              <button
                key={preset.l}
                onClick={() => selectPresetPair(preset.l, preset.f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? "bg-[#1a73e8] text-white shadow-md"
                    : "bg-[#202124] text-[#bdc1c6] hover:text-white border border-[#3c4043]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Left: Lost Item Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-[#202124] border border-[#3c4043] p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#ea4335] text-white">
              • LOST REPORT
            </span>
            <select
              value={currentLost?.id || ""}
              onChange={(e) => {
                const item = lostItems.find(r => r.id === e.target.value);
                setCurrentLost(item);
                if (item && currentFound) handleExecuteMatch(item, currentFound);
              }}
              className="bg-[#121212] border border-[#3c4043] rounded-full text-xs text-[#e8eaed] px-3 py-1 font-bold"
            >
              {lostItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.title.slice(0, 20)}...
                </option>
              ))}
            </select>
          </div>

          {currentLost && (
            <>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#121212] border border-[#3c4043]">
                <img 
                  src={currentLost.imageUrl} 
                  alt={currentLost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-[#202124]/95 backdrop-blur-sm border border-[#3c4043] text-xs text-[#e8eaed]">
                  <span className="text-[#8ab4f8] font-bold">Hallmarks: </span>
                  <span className="font-medium">{currentLost.imageVisualFeatures}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{currentLost.title}</h3>
                <p className="text-xs text-[#bdc1c6] leading-relaxed">{currentLost.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-[#3c4043] text-[#9aa0a6]">
                <div>
                  <span className="text-[10px] font-bold text-[#5f6368] block uppercase">Location</span>
                  <span className="text-white font-medium">{currentLost.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#5f6368] block uppercase">Reported</span>
                  <span className="text-white font-medium">{currentLost.time}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Center: Re-Analyze Trigger */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-3 lg:py-0">
          <button
            onClick={() => handleExecuteMatch(currentLost, currentFound)}
            disabled={isMatching}
            className="p-4 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
          >
            <RefreshCw className={`w-5 h-5 ${isMatching ? 'animate-spin' : ''}`} />
            <span className="text-[10px] uppercase font-bold tracking-wider">
              {isMatching ? "Analyzing" : "Analyze"}
            </span>
          </button>
        </div>

        {/* Right: Found Item Panel */}
        <div className="lg:col-span-5 rounded-3xl bg-[#202124] border border-[#3c4043] p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#34a853] text-white">
              • FOUND REPORT
            </span>
            <select
              value={currentFound?.id || ""}
              onChange={(e) => {
                const item = foundItems.find(r => r.id === e.target.value);
                setCurrentFound(item);
                if (currentLost && item) handleExecuteMatch(currentLost, item);
              }}
              className="bg-[#121212] border border-[#3c4043] rounded-full text-xs text-[#e8eaed] px-3 py-1 font-bold"
            >
              {foundItems.map(item => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.title.slice(0, 20)}...
                </option>
              ))}
            </select>
          </div>

          {currentFound && (
            <>
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#121212] border border-[#3c4043]">
                <img 
                  src={currentFound.imageUrl} 
                  alt={currentFound.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl bg-[#202124]/95 backdrop-blur-sm border border-[#3c4043] text-xs text-[#e8eaed]">
                  <span className="text-[#81c995] font-bold">Hallmarks: </span>
                  <span className="font-medium">{currentFound.imageVisualFeatures}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">{currentFound.title}</h3>
                <p className="text-xs text-[#bdc1c6] leading-relaxed">{currentFound.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-[#3c4043] text-[#9aa0a6]">
                <div>
                  <span className="text-[10px] font-bold text-[#5f6368] block uppercase">Location</span>
                  <span className="text-white font-medium">{currentFound.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#5f6368] block uppercase">Found Time</span>
                  <span className="text-white font-medium">{currentFound.time}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MATCH RESULTS BREAKDOWN */}
      {isMatching ? (
        <div className="p-12 rounded-3xl bg-[#202124] border border-[#3c4043] flex flex-col items-center justify-center text-center space-y-3 animate-fade-in shadow-md">
          <RefreshCw className="w-8 h-8 text-[#4285F4] animate-spin" />
          <h4 className="text-base font-bold text-white">Cross-Referencing Physical & Geospatial Signals</h4>
          <p className="text-xs text-[#9aa0a6]">Analyzing surface markings, colorimetry, and campus transit corridors...</p>
        </div>
      ) : matchResult ? (
        <div className="rounded-3xl bg-[#202124] border border-[#3c4043] p-6 sm:p-8 space-y-6 animate-score shadow-xl">
          
          {/* Header & Overall Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#3c4043]">
            <div className="space-y-1">
              <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                matchResult.overallScore >= 80 ? "bg-[#34a853]/20 text-[#81c995] border border-[#34a853]/40" : "bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/40"
              }`}>
                {matchResult.matchTier.replace("_", " ")}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">AI Match Evaluation</h2>
            </div>

            {/* Score Ring */}
            <div className="flex items-center space-x-4 bg-[#121212] px-5 py-3 rounded-2xl border border-[#3c4043]">
              <div className="text-right">
                <span className="text-[10px] text-[#9aa0a6] uppercase font-bold block">Confidence Score</span>
                <span className="text-xs text-[#8ab4f8] font-semibold">Weighted Total</span>
              </div>
              <div className="text-4xl font-black font-mono text-white">
                {displayScore}%
              </div>
            </div>
          </div>

          {/* Rationale */}
          <div className="p-4 rounded-2xl bg-[#2d2f31] border border-[#3c4043] space-y-1.5 text-xs">
            <span className="text-[#8ab4f8] font-bold uppercase text-[11px] block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Match Rationale:
            </span>
            <p className="text-[#e8eaed] text-sm leading-relaxed font-medium">
              "{matchResult.summaryReason}"
            </p>
          </div>

          {/* 4-SIGNAL BREAKDOWN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Visual Surface Match (40%)", data: matchResult.breakdown.visualSimilarity, color: "bg-[#4285F4]" },
              { label: "Model & Specs (25%)", data: matchResult.breakdown.descriptionSimilarity, color: "bg-[#34A853]" },
              { label: "Campus Proximity (20%)", data: matchResult.breakdown.locationProximity, color: "bg-[#FBBC05]" },
              { label: "Timeline Delta (15%)", data: matchResult.breakdown.timeProximity, color: "bg-[#EA4335]" }
            ].map((sig, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#2d2f31] border border-[#3c4043] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{sig.label}</span>
                  <span className="font-mono font-bold text-white text-sm">{sig.data.score}%</span>
                </div>
                <div className="w-full bg-[#1e1f20] h-2 rounded-full overflow-hidden">
                  <div className={`${sig.color} h-full rounded-full transition-all duration-500`} style={{ width: `${sig.data.score}%` }}></div>
                </div>
                <p className="text-xs text-[#bdc1c6] leading-snug">{sig.data.details}</p>
              </div>
            ))}
          </div>

          {/* Key Visual Evidence Chips */}
          {matchResult.keyVisualEvidence && matchResult.keyVisualEvidence.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#2d2f31] border border-[#3c4043] space-y-2">
              <span className="text-[11px] font-bold uppercase text-[#9aa0a6] block">
                Corroborated Physical Evidence:
              </span>
              <div className="flex flex-wrap gap-2">
                {matchResult.keyVisualEvidence.map((ev, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#34a853]/20 text-[#81c995] border border-[#34a853]/40 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#34a853]" />
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-3 border-t border-[#3c4043] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#9aa0a6]">Proceed to ownership challenge to generate handoff ticket.</span>
            <button
              onClick={() => onStartClaimVerification(currentFound || currentLost)}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md transform hover:scale-105"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Verify Ownership & Claim</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : null}

    </div>
  );
}
