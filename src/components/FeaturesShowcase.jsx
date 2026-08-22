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
      border: darkMode ? "hover:border-[#4285F4]" : "hover:border-[#1a73e8]",
      textColor: darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]",
      cta: "Explore Match Engine",
      action: onJumpToMatches
    },
    {
      id: "feat-2",
      title: "Anti-Fraud Verification",
      description: "Dynamically challenges claimants on private details stored in report ground truth before releasing student contact data.",
      icon: ShieldCheck,
      color: "bg-[#EA4335]",
      border: darkMode ? "hover:border-[#EA4335]" : "hover:border-[#d93025]",
      textColor: darkMode ? "text-[#f28b82]" : "text-[#c5221f]",
      cta: "View Security Engine",
      action: onJumpToMatches
    },
    {
      id: "feat-3",
      title: "Supervised Safe Handoff",
      description: "Encrypted 6-digit PIN and scannable QR claim tickets paired with verified campus drop kiosks (Library, Union, Gym).",
      icon: MapPin,
      color: "bg-[#34A853]",
      border: darkMode ? "hover:border-[#34A853]" : "hover:border-[#1e8e3e]",
      textColor: darkMode ? "text-[#81c995]" : "text-[#137333]",
      cta: "Check Safe Zones",
      action: onJumpToVault
    },
    {
      id: "feat-4",
      title: "Digital QR Safe-Tags",
      description: "Generate privacy-preserving, printable QR recovery tags for laptops, water bottles, and backpacks without exposing phone numbers.",
      icon: QrCode,
      color: "bg-[#FBBC05]",
      border: darkMode ? "hover:border-[#FBBC05]" : "hover:border-[#f9ab00]",
      textColor: darkMode ? "text-[#fdd663]" : "text-[#b06000]",
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
          <h2 className={`text-xl font-bold tracking-tight ${
            darkMode ? "text-white" : "text-[#202124]"
          }`}>
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
              className={`p-5 rounded-3xl border ${feat.border} flex flex-col justify-between space-y-4 transition-all duration-200 shadow-md ${
                darkMode ? "bg-[#202124] border-[#3c4043] hover:shadow-xl" : "bg-white border-[#dadce0] hover:shadow-lg"
              }`}
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-2xl ${feat.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className={`text-base font-bold tracking-tight ${
                  darkMode ? "text-white" : "text-[#202124]"
                }`}>
                  {feat.title}
                </h3>
                <p className={`text-xs leading-relaxed font-normal ${
                  darkMode ? "text-[#bdc1c6]" : "text-[#5f6368]"
                }`}>
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
