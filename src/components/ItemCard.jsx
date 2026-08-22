import React from "react";
import { 
  MapPin, Clock, Shield, Sparkles, Eye, Lock
} from "lucide-react";

export default function ItemCard({ 
  item, 
  onInspect, 
  onTriggerMatch, 
  onStartClaim 
}) {
  const isLost = item.type === "lost";

  return (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-200 border ${
      isLost 
        ? "bg-slate-900 border-slate-800 hover:border-rose-500/60" 
        : "bg-slate-900 border-slate-800 hover:border-emerald-500/60"
    } hover:shadow-xl flex flex-col`}>
      
      {/* Top Banner with Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Subtle Dark Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider shadow-sm ${
            isLost 
              ? "bg-rose-600 text-white" 
              : "bg-emerald-600 text-white"
          }`}>
            {isLost ? "• LOST" : "• FOUND"}
          </span>

          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900/90 backdrop-blur-sm text-slate-200 border border-slate-700">
            {item.category}
          </span>
        </div>

        {/* Visual Features Tag */}
        {item.imageVisualFeatures && (
          <div className="absolute bottom-2.5 left-3 right-3">
            <div className="p-1.5 px-2.5 rounded-lg bg-slate-950/90 backdrop-blur-sm border border-slate-800 text-[11px] text-slate-200 flex items-center gap-1.5 line-clamp-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate font-medium">{item.imageVisualFeatures}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="font-mono text-emerald-400 font-bold">{item.id}</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {item.date} • {item.time}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Privacy Row */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center text-slate-300 gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300 font-medium">{item.reporterAlias}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-semibold">
              <Lock className="w-2.5 h-2.5 text-cyan-400" />
              <span>Masked</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center space-x-2">
          <button
            onClick={() => onInspect(item)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            aria-label={`View details of ${item.title}`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onTriggerMatch(item)}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-black text-slate-950 shadow-sm transition-all flex items-center justify-center gap-1.5"
            aria-label={`Run AI matching for ${item.title}`}
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>AI Match</span>
          </button>
        </div>
      </div>
    </div>
  );
}
