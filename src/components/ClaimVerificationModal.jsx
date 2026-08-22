import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, 
  X, Lock, ShieldAlert, ChevronRight, RefreshCw, Check
} from "lucide-react";
import { generateAntiFraudQuestions, evaluateClaimantAnswers } from "../services/geminiService";

export default function ClaimVerificationModal({ 
  isOpen, 
  onClose, 
  item, 
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
      const qData = await generateAntiFraudQuestions(item, "");
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
      const result = await evaluateClaimantAnswers(questionsData.questions, answers, item, "");
      setEvalResult(result);
    } catch (err) {
      console.error("Failed to evaluate answers:", err);
    } finally {
      setEvaluating(false);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl my-8 overflow-hidden rounded-3xl bg-[#202124] border border-[#3c4043] shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#3c4043]">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-[#EA4335]/20 text-[#f28b82]">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Ownership Verification Challenge
              </h3>
              <p className="text-xs text-[#9aa0a6]">
                Answer ownership security questions to verify genuine ownership before handoff
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#2d2f31] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item Summary Card */}
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#3c4043] flex items-center gap-4">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-16 h-16 rounded-2xl object-cover border border-[#3c4043]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#9aa0a6]">
              <span className="font-mono text-[#8ab4f8] font-bold">{item.id}</span>
              <span>•</span>
              <span className="font-bold text-[#e8eaed]">{item.category}</span>
            </div>
            <h4 className="text-base font-bold text-white truncate">{item.title}</h4>
            <p className="text-xs text-[#9aa0a6] truncate">{item.location}</p>
          </div>
          <div className="text-right text-xs">
            <span className="px-3 py-1 rounded-full bg-[#2d2f31] text-[#bdc1c6] font-mono text-[11px] block font-bold">
              {item.reporterAlias}
            </span>
            <span className="text-[10px] text-[#81c995] mt-1 block font-bold">Encrypted</span>
          </div>
        </div>

        {/* Sample Helper with Lucide Icons */}
        <div className="flex items-center justify-end space-x-2 text-xs">
          <span className="text-[#9aa0a6] text-[11px]">Test with sample answers:</span>
          <button
            type="button"
            onClick={fastFillLegitimate}
            className="px-3.5 py-1.5 rounded-full bg-[#34a853]/20 text-[#81c995] border border-[#34a853]/40 font-bold text-[11px] flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Genuine Owner Sample</span>
          </button>
          <button
            type="button"
            onClick={fastFillImposter}
            className="px-3.5 py-1.5 rounded-full bg-[#2d2f31] text-[#9aa0a6] hover:text-white border border-[#3c4043] font-bold text-[11px] flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Invalid Guess Sample</span>
          </button>
        </div>

        {/* Question Form */}
        {loadingQuestions ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#4285F4] animate-spin" />
            <p className="text-xs text-[#9aa0a6]">Loading ownership verification questions...</p>
          </div>
        ) : (
          <form onSubmit={handleEvaluate} className="space-y-4">
            <div className="space-y-3">
              {questionsData?.questions?.map((q, idx) => (
                <div key={q.id} className="p-4 rounded-2xl bg-[#121212] border border-[#3c4043] space-y-2">
                  <label className="block text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-[10px] font-bold">
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
                    className="w-full px-4 py-2.5 bg-[#1e1f20] border border-[#3c4043] rounded-xl text-xs text-white placeholder-[#5f6368] font-medium focus:border-[#4285F4] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Evaluate Button */}
            {!evalResult && (
              <button
                type="submit"
                disabled={evaluating}
                className="w-full py-3 px-4 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                {evaluating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying responses...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Submit & Verify Ownership</span>
                  </>
                )}
              </button>
            )}
          </form>
        )}

        {/* EVALUATION RESULTS CARD */}
        {evalResult && (
          <div className="rounded-2xl overflow-hidden border border-[#3c4043] bg-[#121212] p-5 space-y-4 animate-score">
            
            {/* Verdict Top Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#3c4043]">
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  evalResult.verdict === "VERIFIED"
                    ? "bg-[#34a853]/20 text-[#81c995] border border-[#34a853]/40"
                    : "bg-[#ea4335]/20 text-[#f28b82] border border-[#ea4335]/40"
                }`}>
                  {evalResult.verdict}
                </span>
                <span className="text-xs text-[#9aa0a6]">
                  Status: <span className={evalResult.fraudRiskLevel === "LOW" ? "text-[#81c995] font-bold" : "text-[#f28b82] font-bold"}>{evalResult.fraudRiskLevel === "LOW" ? "Confirmed Owner" : "Unverified"}</span>
                </span>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white font-mono">
                  {evalResult.verificationScore}%
                </span>
                <span className="text-[10px] text-[#9aa0a6] block font-medium">Confidence Score</span>
              </div>
            </div>

            {/* Rationale */}
            <p className="text-xs text-[#e8eaed] leading-relaxed font-medium">
              "{evalResult.confidenceReason}"
            </p>

            {/* Per-question breakdown */}
            <div className="space-y-2 pt-1">
              {evalResult.questionBreakdown?.map((qb, i) => (
                <div key={i} className="flex items-start gap-2 text-xs p-3 rounded-xl bg-[#1e1f20] border border-[#3c4043]">
                  {qb.isMatch ? (
                    <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-[#ea4335] shrink-0 mt-0.5" />
                  )}
                  <span className="text-[#bdc1c6] font-medium">{qb.feedback}</span>
                </div>
              ))}
            </div>

            {/* Action when Verified */}
            {evalResult.unlockedHandoffEligible ? (
              <div className="pt-3 border-t border-[#3c4043]">
                <button
                  onClick={() => {
                    onClose();
                    onVerificationSuccess(item);
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
                >
                  <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  <span>Security Cleared → Generate Safe Handoff Ticket</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#ea4335]/20 text-xs text-[#f28b82] text-center font-bold border border-[#ea4335]/40">
                Verification failed. Contact details remain protected.
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
