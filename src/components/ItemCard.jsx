import React from "react";
import { 
  MapPin, Clock, ShieldCheck, GitMerge, Lock, 
  Sparkles, Eye, Shield, Tag, ChevronRight
} from "lucide-react";

export default function ItemCard({ 
  item, 
  onInspect, 
  onTriggerMatch, 
  onStartClaim 
}) {
  const isLost = item.type === "lost";

  return (
    <div className="group relative rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-600 transition-all duration-150 overflow-hidden flex flex-col justify-between shadow-sm">
      
      {/* Top Image & Badges */}
      <div className="relative aspect-[16/10] bg-black overflow-hidden">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          loading="lazy"
        />
        
        {/* Status Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
            isLost 
              ? "bg-rose-950/90 text-rose-300 border border-rose-800/80 backdrop-blur-sm" 
              : "bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 backdrop-blur-sm"
          }`}>
            {isLost ? "• LOST" : "• FOUND"}
          </span>
          {item.status === "resolved" && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-950/90 text-blue-300 border border-blue-800/80 backdrop-blur-sm">
              RECOVERED
            </span>
          )}
        </div>

        {/* Category Pill */}
        <div className="absolute top-2.5 right-2.5">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-black/80 text-zinc-300 border border-zinc-700/80 backdrop-blur-sm">
            {item.category}
          </span>
        </div>

        {/* Visual Features Pill */}
        {item.imageVisualFeatures && (
          <div className="absolute bottom-2 left-2 right-2 p-1.5 rounded-lg bg-black/85 backdrop-blur-sm border border-zinc-800 text-[11px] text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-zinc-400 shrink-0" />
            <span className="truncate">{item.imageVisualFeatures}</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>{item.id}</span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Shield className="w-3 h-3" />
              {item.reporterAlias}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-zinc-200 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Metadata: Location & Time */}
        <div className="pt-2 border-t border-zinc-850 grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end text-zinc-500 font-mono">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{item.time}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={() => onInspect(item)}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-200 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span>Specs</span>
          </button>

          <button
            onClick={() => onTriggerMatch(item)}
            className="py-1.5 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            title="Open in Match Hub"
          >
            <GitMerge className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={() => onStartClaim(item)}
            className="py-1.5 px-3 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Claim</span>
          </button>
        </div>

      </div>

    </div>
  );
}
