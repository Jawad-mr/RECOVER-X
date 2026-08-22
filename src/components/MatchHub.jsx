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
  onOpenHandoff,
  darkMode = true
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
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
        darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
      }`}>
        <div>
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${
              darkMode ? "bg-[#4285F4]/20 text-[#8ab4f8]" : "bg-[#e8f0fe] text-[#1a73e8]"
            }`}>
              <GitMerge className="w-5 h-5 text-[#4285F4]" />
            </div>
            <h1 className={`text-2xl font-black tracking-tight ${
              darkMode ? "text-white" : "text-[#202124]"
            }`}>
              AI Multi-Signal Match Hub
            </h1>
          </div>
          <p className={`text-xs mt-1 ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
            Multimodal vision and text analysis cross-referencing physical markings, surface damage, and campus corridors
          </p>
        </div>

        {/* Featured Matches Switcher with Lucide Icons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0" role="toolbar" aria-label="Featured Matches">
          <span className={`text-xs font-bold ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>Featured:</span>
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
                    : darkMode 
                      ? "bg-[#202124] text-[#bdc1c6] hover:text-white border border-[#3c4043]" 
                      : "bg-white text-[#5f6368] hover:text-[#202124] border border-[#dadce0] shadow-sm"
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
        <div className={`lg:col-span-5 rounded-3xl border p-5 space-y-4 shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
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
              className={`border rounded-full text-xs px-3 py-1 font-bold ${
                darkMode ? "bg-[#121212] border-[#3c4043] text-[#e8eaed]" : "bg-[#f8fafd] border-[#dadce0] text-[#202124]"
              }`}
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
              <div className={`relative aspect-[16/10] rounded-2xl overflow-hidden border ${
                darkMode ? "bg-[#121212] border-[#3c4043]" : "bg-[#f1f3f4] border-[#dadce0]"
              }`}>
                <img 
                  src={currentLost.imageUrl} 
                  alt={currentLost.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl backdrop-blur-sm border text-xs ${
                  darkMode ? "bg-[#202124]/95 border-[#3c4043] text-[#e8eaed]" : "bg-white/95 border-[#dadce0] text-[#202124]"
                }`}>
                  <span className={`font-bold ${darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"}`}>Hallmarks: </span>
                  <span className="font-medium">{currentLost.imageVisualFeatures}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>{currentLost.title}</h3>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-[#bdc1c6]" : "text-[#5f6368]"}`}>{currentLost.description}</p>
              </div>

              <div className={`grid grid-cols-2 gap-2 text-xs pt-2.5 border-t ${
                darkMode ? "border-[#3c4043] text-[#9aa0a6]" : "border-[#dadce0] text-[#5f6368]"
              }`}>
                <div>
                  <span className="text-[10px] font-bold block uppercase opacity-75">Location</span>
                  <span className={`font-medium ${darkMode ? "text-white" : "text-[#202124]"}`}>{currentLost.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold block uppercase opacity-75">Reported</span>
                  <span className={`font-medium ${darkMode ? "text-white" : "text-[#202124]"}`}>{currentLost.time}</span>
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
        <div className={`lg:col-span-5 rounded-3xl border p-5 space-y-4 shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
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
              className={`border rounded-full text-xs px-3 py-1 font-bold ${
                darkMode ? "bg-[#121212] border-[#3c4043] text-[#e8eaed]" : "bg-[#f8fafd] border-[#dadce0] text-[#202124]"
              }`}
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
              <div className={`relative aspect-[16/10] rounded-2xl overflow-hidden border ${
                darkMode ? "bg-[#121212] border-[#3c4043]" : "bg-[#f1f3f4] border-[#dadce0]"
              }`}>
                <img 
                  src={currentFound.imageUrl} 
                  alt={currentFound.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl backdrop-blur-sm border text-xs ${
                  darkMode ? "bg-[#202124]/95 border-[#3c4043] text-[#e8eaed]" : "bg-white/95 border-[#dadce0] text-[#202124]"
                }`}>
                  <span className={`font-bold ${darkMode ? "text-[#81c995]" : "text-[#137333]"}`}>Hallmarks: </span>
                  <span className="font-medium">{currentFound.imageVisualFeatures}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>{currentFound.title}</h3>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-[#bdc1c6]" : "text-[#5f6368]"}`}>{currentFound.description}</p>
              </div>

              <div className={`grid grid-cols-2 gap-2 text-xs pt-2.5 border-t ${
                darkMode ? "border-[#3c4043] text-[#9aa0a6]" : "border-[#dadce0] text-[#5f6368]"
              }`}>
                <div>
                  <span className="text-[10px] font-bold block uppercase opacity-75">Location</span>
                  <span className={`font-medium ${darkMode ? "text-white" : "text-[#202124]"}`}>{currentFound.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold block uppercase opacity-75">Found Time</span>
                  <span className={`font-medium ${darkMode ? "text-white" : "text-[#202124]"}`}>{currentFound.time}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MATCH RESULTS BREAKDOWN */}
      {isMatching ? (
        <div className={`p-12 rounded-3xl border flex flex-col items-center justify-center text-center space-y-3 animate-fade-in shadow-md ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
          <RefreshCw className="w-8 h-8 text-[#4285F4] animate-spin" />
          <h4 className={`text-base font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>Cross-Referencing Physical & Geospatial Signals</h4>
          <p className={`text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>Analyzing surface markings, colorimetry, and campus transit corridors...</p>
        </div>
      ) : matchResult ? (
        <div className={`rounded-3xl border p-6 sm:p-8 space-y-6 animate-score shadow-xl ${
          darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
        }`}>
          
          {/* Header & Overall Score */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b ${
            darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
          }`}>
            <div className="space-y-1">
              <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                matchResult.overallScore >= 80 
                  ? darkMode ? "bg-[#34a853]/20 text-[#81c995] border border-[#34a853]/40" : "bg-[#e6f4ea] text-[#137333] border border-[#ceead6]"
                  : darkMode ? "bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/40" : "bg-[#e8f0fe] text-[#1a73e8] border border-[#aecbfa]"
              }`}>
                {matchResult.matchTier.replace("_", " ")}
              </span>
              <h2 className={`text-xl font-bold mt-1 ${darkMode ? "text-white" : "text-[#202124]"}`}>AI Match Evaluation</h2>
            </div>

            {/* Score Ring */}
            <div className={`flex items-center space-x-4 px-5 py-3 rounded-2xl border ${
              darkMode ? "bg-[#121212] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
            }`}>
              <div className="text-right">
                <span className={`text-[10px] uppercase font-bold block ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>Confidence Score</span>
                <span className={`text-xs font-semibold ${darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"}`}>Weighted Total</span>
              </div>
              <div className={`text-4xl font-black font-mono ${darkMode ? "text-white" : "text-[#202124]"}`}>
                {displayScore}%
              </div>
            </div>
          </div>

          {/* Rationale */}
          <div className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
            darkMode ? "bg-[#2d2f31] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
          }`}>
            <span className={`font-bold uppercase text-[11px] block flex items-center gap-1.5 ${
              darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"
            }`}>
              <Sparkles className="w-3.5 h-3.5" />
              Match Rationale:
            </span>
            <p className={`text-sm leading-relaxed font-medium ${
              darkMode ? "text-[#e8eaed]" : "text-[#202124]"
            }`}>
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
              <div key={i} className={`p-4 rounded-2xl border space-y-2 ${
                darkMode ? "bg-[#2d2f31] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold ${darkMode ? "text-white" : "text-[#202124]"}`}>{sig.label}</span>
                  <span className={`font-mono font-bold text-sm ${darkMode ? "text-white" : "text-[#202124]"}`}>{sig.data.score}%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  darkMode ? "bg-[#1e1f20]" : "bg-[#e8eaed]"
                }`}>
                  <div className={`${sig.color} h-full rounded-full transition-all duration-500`} style={{ width: `${sig.data.score}%` }}></div>
                </div>
                <p className={`text-xs leading-snug ${darkMode ? "text-[#bdc1c6]" : "text-[#5f6368]"}`}>{sig.data.details}</p>
              </div>
            ))}
          </div>

          {/* Key Visual Evidence Chips */}
          {matchResult.keyVisualEvidence && matchResult.keyVisualEvidence.length > 0 && (
            <div className={`p-4 rounded-2xl border space-y-2 ${
              darkMode ? "bg-[#2d2f31] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
            }`}>
              <span className={`text-[11px] font-bold uppercase block ${
                darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"
              }`}>
                Corroborated Physical Evidence:
              </span>
              <div className="flex flex-wrap gap-2">
                {matchResult.keyVisualEvidence.map((ev, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${
                    darkMode ? "bg-[#34a853]/20 text-[#81c995] border-[#34a853]/40" : "bg-[#e6f4ea] text-[#137333] border-[#ceead6]"
                  }`}>
                    <Check className="w-3.5 h-3.5 text-[#34a853]" />
                    {ev}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTA */}
          <div className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            darkMode ? "border-[#3c4043]" : "border-[#dadce0]"
          }`}>
            <span className={`text-xs ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>Proceed to ownership challenge to generate handoff ticket.</span>
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
