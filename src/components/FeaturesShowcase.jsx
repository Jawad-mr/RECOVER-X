import React from "react";
import { 
  ShieldCheck, QrCode, MapPin, 
  Eye, ArrowRight, Zap, Triangle
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
      cta: "Explore Match Engine",
      action: onJumpToMatches
    },
    {
      id: "feat-2",
      title: "Anti-Fraud Verification",
      description: "Generates dynamic contextual security questions from hidden ground truth. Evaluates answers semantically before releasing item contact info.",
      icon: ShieldCheck,
      cta: "View Security Protocols",
      action: onJumpToMatches
    },
    {
      id: "feat-3",
      title: "Digital QR Safe Tags",
      description: "Print or display unique privacy-preserving QR recovery tags for laptops, tumblers, and keychains without exposing private student data.",
      icon: QrCode,
      cta: "Generate Safe Tag",
      action: onOpenSmartTag
    },
    {
      id: "feat-4",
      title: "Supervised Safe Handoff",
      description: "Encrypted 6-digit PIN and scannable QR claim tickets paired with verified campus pickup kiosks (Library, Union, Athletics Center).",
      icon: MapPin,
      cta: "Check Safe Zones",
      action: onJumpToVault
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            Core Architecture & Capabilities
          </h2>
          <p className="text-xs text-zinc-400">
            Engineered for high-precision recovery and zero false claims
          </p>
        </div>
      </div>

      {/* 4 Vercel-Style Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all duration-150 ${
                darkMode 
                  ? "bg-zinc-950/80 border-zinc-800/90 hover:border-zinc-600" 
                  : "bg-white border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold tracking-tight text-white">{feat.title}</h3>
                <p className="text-xs leading-relaxed text-zinc-400 font-normal">
                  {feat.description}
                </p>
              </div>

              <button
                onClick={feat.action}
                className="pt-2 text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors group self-start"
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
