import React from "react";
import { 
  MapPin, Clock, Shield, Sparkles, Tag, CheckCircle2, 
  ExternalLink, AlertCircle, ArrowRight, Eye, Lock
} from "lucide-react";

export default function ItemCard({ 
  item, 
  onInspect, 
  onTriggerMatch, 
  onStartClaim 
}) {
  const isLost = item.type === "lost";

  return (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 border ${
      isLost 
        ? "bg-slate-900/90 border-rose-900/30 hover:border-rose-500/50 hover:shadow-rose-950/20" 
        : "bg-slate-900/90 border-emerald-900/30 hover:border-emerald-500/50 hover:shadow-emerald-950/20"
    } hover:shadow-2xl hover:-translate-y-1 flex flex-col`}>
      
      {/* Top Banner with Type & Category */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider shadow-md ${
            isLost 
              ? "bg-rose-600 text-white shadow-rose-950/50" 
              : "bg-emerald-600 text-white shadow-emerald-950/50"
          }`}>
            {isLost ? "• LOST REPORT" : "• FOUND ITEM"}
          </span>

          <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700/60 shadow-md">
            {item.category}
          </span>
        </div>

        {/* Visual Features Pill */}
        {item.imageVisualFeatures && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="p-1.5 px-2.5 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 line-clamp-1">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">AI Vision: {item.imageVisualFeatures}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-mono text-emerald-400/90 font-semibold">{item.id}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              {item.date} • {item.time}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="mt-1 text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Privacy Row */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
          <div className="flex items-center text-slate-400 gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate font-medium text-slate-300">{item.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span className="text-slate-300 font-medium">{item.reporterAlias}</span>
            </div>

            <div className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 border border-slate-700">
              <Lock className="w-2.5 h-2.5 text-cyan-400" />
              <span>Masked</span>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-3 flex items-center space-x-2">
          <button
            onClick={() => onInspect(item)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <button
            onClick={() => onTriggerMatch(item)}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-slate-950 shadow-md shadow-emerald-950/40 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>AI Match</span>
          </button>
        </div>
      </div>
    </div>
  );
}
