import React, { useState } from "react";
import { 
  X, MapPin, Clock, Shield, Lock, Eye, Sparkles, 
  GitMerge, ShieldCheck
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-3xl bg-[#202124] border border-[#3c4043] shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3c4043]">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              isLost ? "bg-[#ea4335] text-white" : "bg-[#34a853] text-white"
            }`}>
              {isLost ? "• LOST REPORT" : "• FOUND ITEM"}
            </span>
            <span className="font-mono text-xs text-[#8ab4f8] font-bold">{item.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#2d2f31] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media & Key Specs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#121212] border border-[#3c4043]">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            {item.imageVisualFeatures && (
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl bg-[#202124]/95 backdrop-blur-sm border border-[#3c4043] text-xs text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fbbc04] shrink-0" />
                <span className="line-clamp-2 font-medium">{item.imageVisualFeatures}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6]">{item.category}</span>
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
            </div>

            <div className="space-y-2 text-xs text-[#bdc1c6] font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ea4335] shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#fbbc04] shrink-0" />
                <span>{item.date} at {item.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#4285f4] shrink-0" />
                <span className="font-mono">{item.reporterAlias} (Encrypted)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#3c4043] grid grid-cols-2 gap-2 text-xs text-[#9aa0a6]">
              <div>
                <span className="text-[#5f6368] block text-[10px] font-bold uppercase">Brand / Make</span>
                <span className="text-white font-bold">{item.brand || "Unspecified"}</span>
              </div>
              <div>
                <span className="text-[#5f6368] block text-[10px] font-bold uppercase">Color / Finish</span>
                <span className="text-white font-bold">{item.color || "Standard"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Public Description */}
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#3c4043] space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0a6] block">
            Public Report Description
          </span>
          <p className="text-xs text-[#e8eaed] leading-relaxed font-medium">
            {item.description}
          </p>
        </div>

        {/* Confidential Ground Truth View */}
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#4285f4]/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8ab4f8] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#4285f4]" />
              <span>Confidential Verification Secret</span>
            </span>
            <button
              onClick={() => setShowHiddenTruth(!showHiddenTruth)}
              className="text-xs font-bold text-[#8ab4f8] hover:underline"
            >
              {showHiddenTruth ? "Hide Details" : "View Security Secret"}
            </button>
          </div>
          
          {showHiddenTruth ? (
            <p className="text-xs text-[#e8eaed] font-mono bg-[#1e1f20] p-3 rounded-xl border border-[#3c4043] leading-relaxed animate-fade-in">
              "{item.hiddenGroundTruth || 'No hidden ground truth stored for this report.'}"
            </p>
          ) : (
            <p className="text-xs text-[#9aa0a6]">
              Hidden from public view. Used exclusively by the automated verification system to dynamically challenge claimants before releasing contact data.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#3c4043]">
          <button
            onClick={() => {
              onClose();
              onTriggerMatch(item);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#2d2f31] hover:bg-[#3c4043] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <GitMerge className="w-4 h-4 text-[#34a853]" />
            <span>Open in AI Match Hub</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onStartClaim(item);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all transform hover:scale-105"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Claim This Item (Verify Ownership)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
