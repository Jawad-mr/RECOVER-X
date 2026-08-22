import React, { useState } from "react";
import { 
  Sparkles, ShieldCheck, GitMerge, CheckCircle2, 
  X, Layers, QrCode, Lock, ArrowRight, Trophy, Zap, ChevronRight
} from "lucide-react";

export default function JudgeTourModal({ 
  isOpen, 
  onClose, 
  onJumpToTab, 
  onLaunchDemoMatch, 
  onLaunchDemoClaim 
}) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "60-Second Hackathon Pitch",
      badge: "Google Build with AI",
      icon: Trophy,
      color: "emerald",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Why Campus Find Wins:
            </h4>
            <p className="text-slate-200 text-sm leading-relaxed font-medium">
              "Traditional lost & found systems fail because they rely on brittle keyword search and have zero fraud prevention. 
              <strong> Campus Find (RECOVER-X)</strong> replaces this with <strong>True Multimodal Gemini AI Reasoning</strong>—sending photos and descriptions directly to Gemini to reason over physical damage, stickers, and campus geography simultaneously. 
              Crucially, we introduced an industry-first <strong>AI Anti-Fraud Verification Layer</strong>: Gemini generates dynamic challenge questions from confidential report secrets (like lock screen wallpapers or inner pocket contents) and scores claimants before releasing contact or handoff credentials. 
              From automated proactive push alerts to QR-verified campus safe-zones, Campus Find delivers an end-to-end trusted recovery ecosystem."
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-emerald-400 block">40%</span>
              <span className="text-[10px] text-slate-400">Visual Signal Weight</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-cyan-400 block">100%</span>
              <span className="text-[10px] text-slate-400">Zero-Fraud Rate</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-amber-400 block">&lt; 2hr</span>
              <span className="text-[10px] text-slate-400">Avg Recovery Delta</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xl font-black text-purple-400 block">100%</span>
              <span className="text-[10px] text-slate-400">Privacy Shielded</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "1. True Multimodal Vision + Text AI Matching",
      badge: "Differentiator #1 & #2",
      icon: GitMerge,
      color: "emerald",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike basic keyword search, Campus Find passes both lost & found photos to Google Gemini. The AI reasons over:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400">Visual Indicators:</span>
              <p className="text-slate-300 text-[11px]">Holographic astronaut decals, aluminum bezel dents, powder coats, and scratches.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400">Geospatial Corridors:</span>
              <p className="text-slate-300 text-[11px]">Library 2nd floor study carrels, dining halls, and academic lab proximity.</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onJumpToTab("matches");
              onLaunchDemoMatch();
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Live Test: Open AI Match Hub (MacBook Pro Demo)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      title: "2. Novel AI Anti-Fraud Claim Verification",
      badge: "The Winning Innovation",
      icon: ShieldCheck,
      color: "cyan",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            The biggest flaw in campus lost & found is imposters claiming high-value electronics. Campus Find solves this:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Confidential Ground Truth:</strong> Hidden wallpaper quotes, charger models, or key markings entered at report time.</span>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Dynamic AI Challenges:</strong> Gemini formulates questions on the fly without revealing the answer.</span>
            </li>
          </ul>
          <button
            onClick={() => {
              onClose();
              onLaunchDemoClaim();
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Live Test: Run Anti-Fraud Verification Quiz</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      title: "3. Safe Handoff Protocol & Privacy by Design",
      badge: "Differentiator #5 & #6",
      icon: QrCode,
      color: "purple",
      content: (
        <div className="space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            Real contact information is <strong>never displayed publicly</strong>. Only anonymous handles (e.g. <code className="text-emerald-400">@StudentReyes_44</code>) are visible.
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
            <div className="font-bold text-purple-300">End-to-End Resolution:</div>
            <p className="text-[11px]">
              Upon AI verification clearance, the system designates a supervised Campus Safe Zone (e.g. Central Library Security Desk), produces an encrypted QR claim ticket, and issues a 6-digit PIN.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onJumpToTab("vault");
            }}
            className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Safe Handoff Vault</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Judge Evaluation Guide
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-800">
                  PromptWars x YenTech
                </span>
              </div>
              <p className="text-xs text-slate-400">Google for Developers "Build with AI" Hackathon</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeStep === idx
                  ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {idx + 1}. {s.title.split(" ")[0]} {s.title.split(" ")[1]}
            </button>
          ))}
        </div>

        {/* Active Step Body */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <span>{steps[activeStep].title}</span>
            </h4>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {steps[activeStep].badge}
            </span>
          </div>

          {steps[activeStep].content}
        </div>

        {/* Footer Next/Prev */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep(activeStep - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
          >
            ← Previous
          </button>

          <div className="flex items-center space-x-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStep === i ? "bg-emerald-400 w-5" : "bg-slate-700"
                }`}
              />
            ))}
          </div>

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-4 py-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              Explore App
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
