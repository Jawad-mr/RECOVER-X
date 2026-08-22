import React from "react";
import { 
  Sparkles, ShieldCheck, QrCode, MapPin, 
  Eye, Zap, ArrowRight, Lock, CheckCircle2, Award
} from "lucide-react";

export default function FeaturesShowcase({ 
  onOpenSmartTag, 
  onJumpToMatches, 
  onJumpToVault,
  darkMode 
}) {
  const features = [
    {
      id: "feat-1",
      title: "Multimodal AI Matching",
      description: "Cross-references image scratches, stickers, dents, colorimetry, and text specifications with a weighted 4-signal confidence breakdown.",
      icon: Eye,
      color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
      cta: "Explore Match Engine",
      action: onJumpToMatches
    },
    {
      id: "feat-2",
      title: "Anti-Fraud Ownership Challenge",
      description: "Generates dynamic contextual security questions from hidden ground truth. Evaluates answers semantically before releasing item contact info.",
      icon: ShieldCheck,
      color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
      cta: "View Security Protocols",
      action: onJumpToMatches
    },
    {
      id: "feat-3",
      title: "Digital QR Safe Tags for Gear",
      description: "Print or display unique privacy-preserving QR recovery tags for laptops, tumblers, and keychains without exposing private student data.",
      icon: QrCode,
      color: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400",
      cta: "Generate Free Safe Tag",
      action: onOpenSmartTag
    },
    {
      id: "feat-4",
      title: "Supervised Safe Handoff Zones",
      description: "Encrypted 6-digit PIN and scannable QR claim tickets paired with verified campus pickup kiosks (Library, Union, Athletics Center).",
      icon: MapPin,
      color: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400",
      cta: "Check Safe Zones",
      action: onJumpToVault
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Next-Gen Platform Innovations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
            Why RECOVER-X is Built Different
          </h2>
        </div>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className={`p-6 rounded-3xl border bg-gradient-to-b flex flex-col justify-between space-y-4 shadow-lg transition-all transform hover:-translate-y-1 ${feat.color} ${
                darkMode ? "bg-slate-900/90" : "bg-white/90"
              }`}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center shadow-md">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-extrabold tracking-tight text-white">{feat.title}</h3>
                <p className={`text-xs leading-relaxed font-medium ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}>
                  {feat.description}
                </p>
              </div>

              <button
                onClick={feat.action}
                className="pt-2 text-xs font-black text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors group self-start"
              >
                <span>{feat.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
