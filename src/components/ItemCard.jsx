import React from "react";
import { 
  MapPin, Clock, ShieldCheck, GitMerge, Lock, 
  Sparkles, Eye, Shield, Tag, ChevronRight
} from "lucide-react";

export default function ItemCard({ 
  item, 
  onInspect, 
  onTriggerMatch, 
  onStartClaim,
  darkMode = true 
}) {
  const isLost = item.type === "lost";

  return (
    <div className={`group relative rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-md ${
      darkMode 
        ? "bg-[#202124] border-[#3c4043] hover:border-[#8ab4f8] hover:shadow-xl" 
        : "bg-white border-[#dadce0] hover:border-[#1a73e8] hover:shadow-lg"
    }`}>
      
      {/* Top Image & Badges */}
      <div className={`relative aspect-[16/10] overflow-hidden ${
        darkMode ? "bg-[#121212]" : "bg-[#f1f3f4]"
      }`}>
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Google Status Badges Overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${
            isLost 
              ? "bg-[#ea4335] text-white" 
              : "bg-[#34a853] text-white"
          }`}>
            {isLost ? "• LOST" : "• FOUND"}
          </span>
          {item.status === "resolved" && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#1a73e8] text-white shadow-sm">
              RECOVERED
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm shadow-sm border ${
            darkMode 
              ? "bg-[#202124]/90 text-[#e8eaed] border-[#5f6368]" 
              : "bg-white/90 text-[#202124] border-[#dadce0]"
          }`}>
            {item.category}
          </span>
        </div>

        {/* Visual Features Pill */}
        {item.imageVisualFeatures && (
          <div className={`absolute bottom-2.5 left-2.5 right-2.5 p-2 rounded-xl backdrop-blur-sm border text-[11px] flex items-center gap-1.5 ${
            darkMode 
              ? "bg-[#202124]/95 border-[#3c4043] text-[#e8eaed]" 
              : "bg-white/95 border-[#dadce0] text-[#202124]"
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-[#fbbc04] shrink-0" />
            <span className="truncate font-medium">{item.imageVisualFeatures}</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-mono font-bold ${darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"}`}>
              {item.id}
            </span>
            <span className={`flex items-center gap-1 ${darkMode ? "text-[#9aa0a6]" : "text-[#5f6368]"}`}>
              <Shield className="w-3 h-3 text-[#34a853]" />
              {item.reporterAlias}
            </span>
          </div>

          <h3 className={`text-base font-bold tracking-tight transition-colors line-clamp-1 ${
            darkMode ? "text-white group-hover:text-[#8ab4f8]" : "text-[#202124] group-hover:text-[#1a73e8]"
          }`}>
            {item.title}
          </h3>

          <p className={`text-xs line-clamp-2 leading-relaxed ${
            darkMode ? "text-[#bdc1c6]" : "text-[#5f6368]"
          }`}>
            {item.description}
          </p>
        </div>

        {/* Metadata: Location & Time */}
        <div className={`pt-2 border-t grid grid-cols-2 gap-2 text-xs ${
          darkMode ? "border-[#3c4043] text-[#9aa0a6]" : "border-[#dadce0] text-[#5f6368]"
        }`}>
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#ea4335] shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <Clock className="w-3.5 h-3.5 text-[#fbbc04] shrink-0" />
            <span>{item.time}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={() => onInspect(item)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
              darkMode 
                ? "bg-[#2d2f31] hover:bg-[#3c4043] text-[#e8eaed]" 
                : "bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124]"
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${darkMode ? "text-[#8ab4f8]" : "text-[#1a73e8]"}`} />
            <span>Details</span>
          </button>

          <button
            onClick={() => onTriggerMatch(item)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
              darkMode 
                ? "bg-[#2d2f31] hover:bg-[#3c4043] text-[#e8eaed]" 
                : "bg-[#f1f3f4] hover:bg-[#e8eaed] text-[#202124]"
            }`}
            title="Open in AI Match Hub"
          >
            <GitMerge className="w-3.5 h-3.5 text-[#34a853]" />
          </button>

          <button
            onClick={() => onStartClaim(item)}
            className="py-2 px-4 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md flex items-center justify-center gap-1 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Claim</span>
          </button>
        </div>

      </div>

    </div>
  );
}
