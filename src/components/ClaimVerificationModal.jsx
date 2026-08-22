import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, 
  X, Lock, ShieldAlert, ChevronRight, RefreshCw
} from "lucide-react";
import { generateAntiFraudQuestions, evaluateClaimantAnswers } from "../services/geminiService";

export default function ClaimVerificationModal({ 
  isOpen, 
  onClose, 
  item, 
  apiKey,
  onVerificationSuccess
}) {
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsData, setQuestionsData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  useEffect(() => {
    if (isOpen && item) {
      setEvalResult(null);
      setAnswers({});
      fetchQuestions();
    }
  }, [isOpen, item]);

  const fetchQuestions = async () => {
    if (!item) return;
    setLoadingQuestions(true);
    try {
      const qData = await generateAntiFraudQuestions(item, apiKey);
      setQuestionsData(qData);
      const initialAnswers = {};
      qData.questions.forEach(q => { initialAnswers[q.id] = ""; });
      setAnswers(initialAnswers);
    } catch (err) {
      console.error("Failed to generate questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!questionsData || !item) return;
    setEvaluating(true);
    try {
      const result = await evaluateClaimantAnswers(questionsData.questions, answers, item, apiKey);
      setEvalResult(result);
    } catch (err) {
      console.error("Failed to evaluate answers:", err);
    } finally {
      setEvaluating(false);
    }
  };

  // Quick fill helper
  const fastFillLegitimate = () => {
    if (!questionsData || !item) return;
    const newAnswers = {};
    
    const hidden = item.hiddenGroundTruth || "";
    questionsData.questions.forEach(q => {
      if (q.id.includes("wallpaper") || q.question.toLowerCase().includes("wallpaper") || q.question.toLowerCase().includes("lock screen")) {
        newAnswers[q.id] = "Deep space red cosmic nebula with 'Stay Hungry' text";
      } else if (q.id.includes("accessories") || q.question.toLowerCase().includes("accessory") || q.question.toLowerCase().includes("cable")) {
        newAnswers[q.id] = "Black 65W Anker GaN charger in the side zip pocket";
      } else if (q.id.includes("custom_mark") || q.question.toLowerCase().includes("seal") || q.question.toLowerCase().includes("bottom")) {
        newAnswers[q.id] = "Bright orange silicone gasket ring inside cap, and 'M. LIN' in silver sharpie under base";
      } else if (q.id.includes("pocket") || q.question.toLowerCase().includes("compartment") || q.question.toLowerCase().includes("pocket")) {
        newAnswers[q.id] = "3 dorm keys with green tag and silver USB labeled CHEM-HONORS-2026";
      } else if (q.id.includes("wallet") || q.question.toLowerCase().includes("cash") || q.question.toLowerCase().includes("receipt")) {
        newAnswers[q.id] = "Folded $20 emergency triangle bill and Aug 19 bookstore receipt";
      } else {
        newAnswers[q.id] = hidden.slice(0, 40);
      }
    });

    setAnswers(newAnswers);
  };

  const fastFillImposter = () => {
    if (!questionsData) return;
    const newAnswers = {};
    questionsData.questions.forEach(q => {
      newAnswers[q.id] = "I think it was just a standard blue background and some random cables";
    });
    setAnswers(newAnswers);
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Ownership Verification Challenge
              </h3>
              <p className="text-xs text-slate-400">
                Answer ownership security questions to verify genuine ownership before handoff
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

        {/* Item Summary Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-4">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-16 h-16 rounded-xl object-cover border border-slate-800"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-emerald-400 font-bold">{item.id}</span>
              <span>•</span>
              <span className="font-semibold text-slate-300">{item.category}</span>
            </div>
            <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
            <p className="text-xs text-slate-400 truncate">{item.location}</p>
          </div>
          <div className="text-right text-xs">
            <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px] block font-semibold">
              {item.reporterAlias}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 block font-medium">Privacy Masked</span>
          </div>
        </div>

        {/* Quick Fill Sample Helper */}
        <div className="flex items-center justify-end space-x-2 text-xs">
          <span className="text-slate-500 text-[11px]">Test with sample answers:</span>
          <button
            type="button"
            onClick={fastFillLegitimate}
            className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900 font-bold text-[11px] transition-colors"
          >
            ✓ Genuine Owner Sample
          </button>
          <button
            type="button"
            onClick={fastFillImposter}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 font-bold text-[11px] transition-colors"
          >
            ✕ Invalid Guess Sample
          </button>
        </div>

        {/* Question Form */}
        {loadingQuestions ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
            <p className="text-xs text-slate-400">Loading ownership verification questions...</p>
          </div>
        ) : (
          <form onSubmit={handleEvaluate} className="space-y-4">
            <div className="space-y-3">
              {questionsData?.questions?.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center justify-center text-[10px] font-mono font-bold">
                      {idx + 1}
                    </span>
                    <span>{q.question}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                    placeholder="Provide specific details you know about this item..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-medium"
                  />
                </div>
              ))}
            </div>

            {/* Evaluate Button */}
            {!evalResult && (
              <button
                type="submit"
                disabled={evaluating}
                className="w-full py-3 px-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                {evaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Verifying responses...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[3]" />
                    <span>Submit & Verify Ownership</span>
                  </>
                )}
              </button>
            )}
          </form>
        )}

        {/* EVALUATION RESULTS CARD */}
        {evalResult && (
          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-5 space-y-4 animate-score">
            
            {/* Verdict Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                  evalResult.verdict === "VERIFIED"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                    : "bg-rose-950 text-rose-300 border border-rose-700"
                }`}>
                  {evalResult.verdict}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Trust Status: <span className={evalResult.fraudRiskLevel === "LOW" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{evalResult.fraudRiskLevel === "LOW" ? "Confirmed Owner" : "Unverified"}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white font-mono">
                  {evalResult.verificationScore}%
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">Confidence Score</span>
              </div>
            </div>

            {/* Rationale */}
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{evalResult.confidenceReason}"
            </p>

            {/* Per-question breakdown */}
            <div className="space-y-2 pt-1">
              {evalResult.questionBreakdown?.map((qb, i) => (
                <div key={i} className="flex items-start gap-2 text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  {qb.isMatch ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-slate-300 font-medium">{qb.feedback}</span>
                </div>
              ))}
            </div>

            {/* Action when Verified */}
            {evalResult.unlockedHandoffEligible ? (
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    onClose();
                    onVerificationSuccess(item);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-md flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
                >
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Security Cleared → Generate Safe Handoff Ticket</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950 text-xs text-rose-300 text-center font-semibold border border-rose-800">
                Verification failed. Contact details remain protected.
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
