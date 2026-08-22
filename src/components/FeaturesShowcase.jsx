import React from "react";
import { 
  ShieldCheck, QrCode, MapPin, 
  Eye, ArrowRight, Sparkles, Lock, CheckCircle2
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
      description: "Cross-references image scratches, custom stickers, dents, and text specifications with an explainable 4-signal confidence breakdown.",
      icon: Eye,
      color: "bg-[#4285F4]",
      border: "hover:border-[#4285F4]",
      textColor: "text-[#8ab4f8]",
      cta: "Explore Match Engine",
      action: onJumpToMatches
    },
    {
      id: "feat-2",
      title: "Anti-Fraud Verification",
      description: "Dynamically challenges claimants on private details stored in report ground truth before releasing student contact data.",
      icon: ShieldCheck,
      color: "bg-[#EA4335]",
      border: "hover:border-[#EA4335]",
      textColor: "text-[#f28b82]",
      cta: "View Security Engine",
      action: onJumpToMatches
    },
    {
      id: "feat-3",
      title: "Supervised Safe Handoff",
      description: "Encrypted 6-digit PIN and scannable QR claim tickets paired with verified campus drop kiosks (Library, Union, Gym).",
      icon: MapPin,
      color: "bg-[#34A853]",
      border: "hover:border-[#34A853]",
      textColor: "text-[#81c995]",
      cta: "Check Safe Zones",
      action: onJumpToVault
    },
    {
      id: "feat-4",
      title: "Digital QR Safe-Tags",
      description: "Generate privacy-preserving, printable QR recovery tags for laptops, water bottles, and backpacks without exposing phone numbers.",
      icon: QrCode,
      color: "bg-[#FBBC05]",
      border: "hover:border-[#FBBC05]",
      textColor: "text-[#fdd663]",
      cta: "Generate Free Safe Tag",
      action: onOpenSmartTag
    }
  ];

  return (
    <div className="space-y-4">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#4285F4]"></span>
            <span className="text-[#4285F4]">Next-Gen Campus Ecosystem</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Core Architecture & Capabilities
          </h2>
        </div>
      </div>

      {/* 4 Google-Themed Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className={`p-5 rounded-2xl border bg-[#202124] border-[#3c4043] ${feat.border} flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-lg`}
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-2xl ${feat.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold tracking-tight text-white">{feat.title}</h3>
                <p className="text-xs leading-relaxed text-[#bdc1c6] font-normal">
                  {feat.description}
                </p>
              </div>

              <button
                onClick={feat.action}
                className={`pt-2 text-xs font-bold ${feat.textColor} hover:underline flex items-center gap-1 transition-all group self-start`}
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
