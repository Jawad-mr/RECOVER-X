import React from "react";

export default function RecoverXLogo({ className = "w-8 h-8", isSmall = false }) {
  return (
    <div className={`${className} rounded-xl bg-gradient-to-br from-[#4285F4] via-[#1a73e8] to-[#34A853] flex items-center justify-center shadow-md p-1.5 shrink-0 transition-transform hover:scale-105`}>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Radar wave arc */}
        <path 
          d="M3.5 12a8.5 8.5 0 0117 0" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          opacity="0.75"
        />
        {/* High-tech stylized X */}
        <path 
          d="M6.5 6.5l11 11M17.5 6.5l-11 11" 
          stroke="white" 
          strokeWidth="2.8" 
          strokeLinecap="round"
        />
        {/* Central Core Radar Lens */}
        <circle 
          cx="12" 
          cy="12" 
          r="3" 
          fill="#FBBC05" 
          stroke="#ffffff" 
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
