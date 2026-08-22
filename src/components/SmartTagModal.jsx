import React, { useState } from "react";
import { 
  QrCode, Sparkles, X, Shield, Download, Copy, 
  Check, Laptop, Smartphone, Briefcase, Coffee
} from "lucide-react";

export default function SmartTagModal({ isOpen, onClose }) {
  const [itemName, setItemName] = useState("MacBook Pro 14");
  const [itemCategory, setItemCategory] = useState("Electronics");
  const [alias, setAlias] = useState("@Student_749");
  const [copied, setCopied] = useState(false);
  const [tagId] = useState(`TAG-${Math.floor(100000 + Math.random() * 900000)}`);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg my-8 overflow-hidden rounded-3xl bg-[#202124] border border-[#3c4043] shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3c4043]">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-[#FBBC05]/20 text-[#fdd663]">
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                RECOVER-X Safe Tag Generator
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Generate privacy-protected QR tags for your campus devices
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#2d2f31] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tag Customizer */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-[#bdc1c6] mb-1">
                Item Nickname
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#3c4043] rounded-xl text-xs text-white placeholder-[#5f6368] focus:border-[#4285F4] focus:outline-none"
                placeholder="e.g. Blue Hydro Flask"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#bdc1c6] mb-1">
                Category
              </label>
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#121212] border border-[#3c4043] rounded-xl text-xs text-white focus:border-[#4285F4] focus:outline-none"
              >
                <option value="Electronics">Electronics</option>
                <option value="Water Bottles">Water Bottles</option>
                <option value="Backpacks">Backpacks</option>
                <option value="Keychains">Keychains & Badges</option>
              </select>
            </div>
          </div>

          {/* Printable Tag Visual Card */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#fbbc04]/40 text-center space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#fdd663] font-mono tracking-wider">{tagId}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fbbc04]/20 text-[#fdd663] border border-[#fbbc04]/40 text-[10px]">
                RECOVER-X SAFE TAG
              </span>
            </div>

            {/* QR Mockup */}
            <div className="w-36 h-36 mx-auto bg-white p-3 rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-1">
              <QrCode className="w-24 h-24 text-[#202124]" />
              <span className="text-[8px] font-black text-[#202124] tracking-tighter uppercase">
                Scan to Return
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">{itemName || "Campus Item"}</h4>
              <p className="text-xs text-[#9aa0a6] font-mono">Protected Owner: {alias}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#1e1f20] border border-[#3c4043] text-[11px] text-[#bdc1c6] leading-snug">
              If found, scanning this code opens an anonymous RECOVER-X return portal without exposing your phone number or email.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#3c4043]">
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#2d2f31] hover:bg-[#3c4043] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#81c995]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Safe Link Copied!" : "Copy Safe Tag Link"}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all transform hover:scale-105"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Done & Print Safe Tag</span>
          </button>
        </div>

      </div>
    </div>
  );
}
