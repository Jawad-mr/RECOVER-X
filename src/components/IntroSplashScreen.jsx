import React, { useState, useEffect } from "react";
import { 
  Sparkles, ShieldCheck, Eye, QrCode, MapPin, 
  ArrowRight, CheckCircle2, Zap, Cpu
} from "lucide-react";
import RecoverXLogo from "./RecoverXLogo";

export default function IntroSplashScreen({ onComplete, darkMode }) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const steps = [
    { label: "Initializing Multimodal Vision Engine...", sub: "Calibrating visual hallmark analysis" },
    { label: "Syncing Campus Geospatial Safe Zones...", sub: "Connecting Library, Science, Gym, Union kiosks" },
    { label: "Arming Zero-Knowledge Anti-Fraud Shield...", sub: "Securing confidential report ground truth" },
    { label: "RECOVER-X Core Online", sub: "Ready for smart campus item recovery" }
  ];

  const features = [
    { icon: Eye, title: "Multimodal AI Matching", desc: "Hallmark & Spec Analysis", color: "text-[#4285F4]" },
    { icon: ShieldCheck, title: "Anti-Fraud Verification", desc: "Zero-Knowledge Ownership Challenge", color: "text-[#EA4335]" },
    { icon: MapPin, title: "Supervised Safe Handoff", desc: "Encrypted QR Claim Tickets", color: "text-[#34A853]" },
    { icon: QrCode, title: "Digital QR Safe-Tags", desc: "Printable Device Protection", color: "text-[#FBBC05]" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(onComplete, 350);
          }, 300);
          return 100;
        }
        const next = prev + 4;
        if (next > 75) setCurrentStepIndex(3);
        else if (next > 50) setCurrentStepIndex(2);
        else if (next > 25) setCurrentStepIndex(1);
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
    } ${
      darkMode ? "bg-[#121212] text-[#e8eaed]" : "bg-[#f8fafd] text-[#202124]"
    }`}>
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#4285F4]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#34A853]/10 rounded-full blur-3xl"></div>
      </div>

      <div className={`relative max-w-lg w-full rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 text-center ${
        darkMode ? "bg-[#202124]/90 border-[#3c4043] backdrop-blur-md" : "bg-white/90 border-[#dadce0] backdrop-blur-md"
      }`}>
        
        {/* Animated Brand Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#4285F4]/30 rounded-2xl blur-lg animate-pulse"></div>
            <RecoverXLogo className="w-16 h-16 relative" />
          </div>

          <div>
            <div className="flex items-center justify-center text-2xl font-black tracking-tight">
              <span className="text-[#4285F4]">R</span>
              <span className="text-[#EA4335]">E</span>
              <span className="text-[#FBBC05]">C</span>
              <span className="text-[#4285F4]">O</span>
              <span className="text-[#34A853]">V</span>
              <span className="text-[#EA4335]">E</span>
              <span className="text-[#4285F4]">R</span>
              <span className={darkMode ? "text-white" : "text-[#202124]"}>-X</span>
            </div>
            <p className={`text-xs font-semibold mt-0.5 ${
              darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"
            }`}>
              Smart Campus Lost & Found Ecosystem
            </p>
          </div>
        </div>

        {/* Dynamic Boot Step Text */}
        <div className={`p-3.5 rounded-2xl border space-y-1 ${
          darkMode ? "bg-[#121212] border-[#3c4043]" : "bg-[#f8fafd] border-[#dadce0]"
        }`}>
          <div className="flex items-center justify-between text-xs font-bold">
            <span className={darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"}>
              {steps[currentStepIndex].label}
            </span>
            <span className="font-mono text-[11px] text-[#34a853]">{progress}%</span>
          </div>
          <p className={`text-[11px] text-left truncate ${
            darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"
          }`}>
            {steps[currentStepIndex].sub}
          </p>

          {/* Progress bar */}
          <div className={`w-full h-1.5 rounded-full overflow-hidden mt-2 ${
            darkMode ? "bg-[#1e1f20]" : "bg-[#e8eaed]"
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-[#4285F4] via-[#FBBC05] to-[#34A853] rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 4 Core Features Showcase Inside Splash */}
        <div className="space-y-2 text-left">
          <span className={`text-[10px] font-bold uppercase tracking-wider block ${
            darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"
          }`}>
            System Capabilities Ready:
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div 
                  key={i} 
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    darkMode ? "bg-[#2d2f31]/70 border-[#3c4043]" : "bg-[#f1f3f4]/70 border-[#dadce0]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${f.color}`} />
                  <div className="min-w-0">
                    <h5 className={`text-[11px] font-bold truncate ${
                      darkMode ? "text-white" : "text-[#202124]"
                    }`}>{f.title}</h5>
                    <p className={`text-[9px] truncate ${
                      darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"
                    }`}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skip / Enter Action */}
        <div className="pt-2 flex items-center justify-between">
          <span className={`text-[10px] font-medium ${darkMode ? "text-[#5f6368]" : "text-[#9aa0a6]"}`}>
            Google Build with AI Hackathon
          </span>

          <button
            onClick={handleSkip}
            className="px-4 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
}
