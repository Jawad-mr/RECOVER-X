import React, { useState } from "react";
import { 
  ShieldCheck, MapPin, Clock, CheckCircle2, 
  X, Mail, User, Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { SAFE_HANDOFF_ZONES } from "../data/seedData";

export default function SafeHandoffModal({ 
  isOpen, 
  onClose, 
  item,
  onHandoffComplete
}) {
  const [selectedZone, setSelectedZone] = useState(SAFE_HANDOFF_ZONES[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("Today • 3:30 PM - 5:30 PM");
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !item) return null;

  const ticketCode = `TK-CF-${item.id.replace('REP-', '')}-8892`;
  const verificationPin = "749-102";

  const handleCompleteHandoff = () => {
    setIsCompleted(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (onHandoffComplete) {
      onHandoffComplete(item.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Safe Handoff Protocol & Claim Ticket
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Step 5 / Safe Loop
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Coordinated exchange at verified campus safety zones with scannable QR ticket
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCompleted ? (
          <>
            {/* Step 1: Select Designated Campus Safe Zone */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                1. Select Supervised Campus Safe Zone
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAFE_HANDOFF_ZONES.map((zone) => (
                  <div
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      selectedZone.id === zone.id
                        ? "bg-slate-800 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="font-bold text-white mb-1 flex items-center justify-between">
                      <span className="truncate">{zone.name}</span>
                      {selectedZone.id === zone.id && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">{zone.location}</p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-400">
                      {zone.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Select Time Window */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                2. Recommended Supervised Time Windows
              </label>

              <div className="flex flex-wrap gap-2">
                {[
                  "Today • 3:30 PM - 5:30 PM",
                  "Today • 6:00 PM - 8:00 PM",
                  "Tomorrow • 10:00 AM - 12:00 PM"
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedTimeSlot === slot
                        ? "bg-cyan-500 text-slate-950 shadow-sm"
                        : "bg-slate-950 border border-slate-800 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Verified Claim Ticket & Scannable QR */}
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                    Official Campus Claim Ticket
                  </span>
                  <h4 className="text-base font-extrabold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-mono">{ticketCode}</p>
                </div>

                {/* Scannable QR Code */}
                <div className="p-3 bg-white rounded-2xl shadow-md flex flex-col items-center">
                  <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="white"/>
                    <path fill="#0f172a" d="M10 10h30v30H10zM18 18h14v14H18zM60 10h30v30H60zM68 18h14v14H68zM10 60h30v30H10zM18 68h14v14H18zM45 10h10v10H45zM45 25h10v10H45zM45 40h10v10H45zM10 45h10v10H10zM25 45h10v10H25zM60 45h10v10H60zM75 45h15v10H75zM45 60h10v15H45zM60 60h15v10H60zM80 60h10v15H80zM60 75h10v15H60zM75 80h15v10H75zM45 80h10v10H45z"/>
                  </svg>
                  <span className="text-[9px] font-bold text-slate-900 mt-1 font-mono">SCAN AT DESK</span>
                </div>
              </div>

              {/* Revealed Contact & Security PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Verified Owner</span>
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.reporterName || "Julian Reyes"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{item.contactEmail || "j.reyes@campus.edu"}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">Handoff PIN</span>
                  <div className="text-xl font-black font-mono text-white tracking-wider">
                    {verificationPin}
                  </div>
                  <span className="text-[10px] text-slate-400 block">Present PIN to staff on duty</span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleCompleteHandoff}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>Confirm Handoff & Resolve Item</span>
              </button>
            </div>
          </>
        ) : (
          /* Completed Success Screen */
          <div className="py-8 text-center space-y-4 animate-score">
            <div className="w-16 h-16 rounded-3xl bg-emerald-950 text-emerald-400 border border-emerald-700 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">Item Successfully Recovered!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Handoff confirmed at <span className="text-emerald-400 font-bold">{selectedZone.name}</span>. Report #{item.id} has been marked as officially resolved in the campus ledger.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-sm mx-auto text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Receipt Number:</span>
                <span className="font-mono text-white font-bold">REC-2026-0821-X9</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Recovery Delta:</span>
                <span className="text-emerald-400 font-bold">1 hr 45 min</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Trust Impact:</span>
                <span className="text-emerald-400 font-bold">+50 Campus Karma</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Back to Campus Explorer
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
