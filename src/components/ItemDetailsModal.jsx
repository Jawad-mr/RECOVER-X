import React, { useState } from "react";
import { 
  X, MapPin, Clock, Shield, Lock, Eye, Sparkles, 
  GitMerge, ShieldCheck, Tag, ExternalLink, User, AlertCircle
} from "lucide-react";

export default function ItemDetailsModal({ 
  isOpen, 
  onClose, 
  item, 
  onTriggerMatch, 
  onStartClaim 
}) {
  const [showHiddenTruth, setShowHiddenTruth] = useState(false);

  if (!isOpen || !item) return null;
  const isLost = item.type === "lost";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
              isLost ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            }`}>
              {isLost ? "• LOST REPORT" : "• FOUND ITEM"}
            </span>
            <span className="font-mono text-xs text-slate-400 font-semibold">{item.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media & Key Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            {item.imageVisualFeatures && (
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="line-clamp-2">Vision Analysis: {item.imageVisualFeatures}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
              <h3 className="text-lg font-black text-white">{item.title}</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{item.date} at {item.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono">{item.reporterAlias} (Masked Handle)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div>
                <span className="text-slate-500 block text-[10px]">Brand / Make</span>
                <span className="text-white font-medium">{item.brand || "Unspecified"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Color / Finish</span>
                <span className="text-white font-medium">{item.color || "Standard"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Public Description */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Public Report Description
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Judge Inspect: Hidden Anti-Fraud Truth Toggle */}
        <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Confidential Ground Truth (Anti-Fraud Secret)</span>
            </span>
            <button
              onClick={() => setShowHiddenTruth(!showHiddenTruth)}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              {showHiddenTruth ? "Hide Secret" : "Judge View: Reveal Secret"}
            </button>
          </div>
          
          {showHiddenTruth ? (
            <p className="text-xs text-cyan-200 font-mono bg-slate-950 p-3 rounded-xl border border-cyan-900 leading-relaxed animate-fade-in">
              "{item.hiddenGroundTruth || 'No hidden ground truth stored for this test item.'}"
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">
              Hidden from campus users. Used exclusively by Gemini AI to dynamically challenge claimants before releasing contact data.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onTriggerMatch(item);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <GitMerge className="w-4 h-4 text-emerald-400" />
            <span>Open in AI Match Hub</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartClaim(item);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5 transition-all transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Claim This Item (AI Verification)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
