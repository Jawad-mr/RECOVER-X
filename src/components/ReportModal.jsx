import React, { useState } from "react";
import { 
  Plus, Camera, Sparkles, X, MapPin, Clock, Shield, 
  Lock, Check, Image as ImageIcon, RefreshCw, CheckCircle2
} from "lucide-react";
import { CATEGORIES, CAMPUS_LOCATIONS, DEMO_PRESET_PHOTOS } from "../data/seedData";
import { analyzeUploadedImage } from "../services/geminiService";

export default function ReportModal({ 
  isOpen, 
  onClose, 
  onSubmitReport, 
  apiKey 
}) {
  const [reportType, setReportType] = useState("lost");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0].name);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("14:00");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [imageUrl, setImageUrl] = useState(DEMO_PRESET_PHOTOS[0].url);
  const [visualFeatures, setVisualFeatures] = useState("");
  const [hiddenGroundTruth, setHiddenGroundTruth] = useState("");
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiAnalysisCompleted, setAiAnalysisCompleted] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setImageUrl(preset.url);
    setTitle(preset.title);
    setCategory(preset.category);
    setColor(preset.color);
    setBrand(preset.brand);
    setVisualFeatures(preset.features);
    setDescription(preset.sampleDescription);
    setHiddenGroundTruth(preset.sampleHidden);
    setAiAnalysisCompleted(true);
  };

  const handleAnalyzeWithAI = async () => {
    setIsAnalyzingImage(true);
    try {
      const analysis = await analyzeUploadedImage(imageUrl, apiKey);
      if (analysis) {
        if (analysis.color) setColor(analysis.color);
        if (analysis.brand) setBrand(analysis.brand);
        if (analysis.visualFeatures) setVisualFeatures(analysis.visualFeatures);
        if (analysis.suggestedDescription && !description) setDescription(analysis.suggestedDescription);
        setAiAnalysisCompleted(true);
      }
    } catch (err) {
      console.error("Image analysis failed:", err);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      type: reportType,
      title: title || "Untitled Campus Item",
      category,
      description,
      location,
      date,
      time,
      color,
      brand,
      imageUrl: imageUrl || DEMO_PRESET_PHOTOS[0].url,
      imageVisualFeatures: visualFeatures || "Standard form factor with identifiable surface details",
      hiddenGroundTruth,
      reporterAlias: `@Campus_${Math.floor(1000 + Math.random() * 9000)}`,
      reporterName: "Campus Student",
      contactEmail: "student@campus.edu",
      contactPhone: "+1 (555) 019-2819",
      status: "open",
      createdAt: new Date().toISOString(),
      isPreSeeded: false
    };

    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl my-8 overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-2xl ${
              reportType === 'lost' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                Submit Campus Item Report
              </h3>
              <p className="text-xs text-slate-400">
                AI Vision pre-processing & proactive match radar
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Report Type Selector */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setReportType("lost")}
              className={`py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all ${
                reportType === "lost"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>I LOST Something</span>
            </button>

            <button
              type="button"
              onClick={() => setReportType("found")}
              className={`py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all ${
                reportType === "found"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>I FOUND Something</span>
            </button>
          </div>

          {/* Quick Preset Selector for Easy Testing */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Quick Preset Sample Photos (1-Click Fill):</span>
              <span className="text-emerald-400 font-semibold text-[11px]">Instant test data</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {DEMO_PRESET_PHOTOS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2 rounded-xl border text-left flex flex-col items-center text-xs transition-all ${
                    imageUrl === preset.url
                      ? "bg-slate-800 border-emerald-500 ring-1 ring-emerald-500 shadow-sm"
                      : "bg-slate-950 border-slate-800 hover:bg-slate-800/80"
                  }`}
                >
                  <img 
                    src={preset.url} 
                    alt={preset.title}
                    className="w-full h-14 rounded-lg object-cover mb-1.5" 
                  />
                  <span className="text-[10px] font-bold text-slate-200 line-clamp-1 text-center">
                    {preset.title.split(" ")[0]} {preset.title.split(" ")[1]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Preview & AI Vision Auto-Tagging */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <img 
                  src={imageUrl} 
                  alt="Item preview" 
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700" 
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Item Image & Visual Feature Extractor</h4>
                  <p className="text-[11px] text-slate-400">Gemini analyzes surface damage, decals, and geometry</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAnalyzeWithAI}
                disabled={isAnalyzingImage}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingImage ? 'animate-spin' : ''}`} />
                <span>{isAnalyzingImage ? "Extracting Hallmarks..." : "Auto-Tag with Gemini Vision"}</span>
              </button>
            </div>

            {/* VISUALLY DISTINGUISHED: WHAT THE AI UNDERSTOOD */}
            {aiAnalysisCompleted && visualFeatures && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs text-slate-200 space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Gemini Vision Interpretation:</span>
                </div>
                <p className="text-slate-200 font-medium leading-relaxed">
                  "{visualFeatures}"
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-semibold text-emerald-300">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">Color: {color || 'Detected'}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">Brand: {brand || 'Detected'}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">Category: {category}</span>
                </div>
              </div>
            )}
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 14-inch Space Gray MacBook Pro"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-medium"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Public Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
              Public Description (Visible to Campus) *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, visible decals, dents, condition..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 resize-none font-medium"
            />
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Campus Location *
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-medium"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-medium"
              />
            </div>
          </div>

          {/* HIDDEN GROUND TRUTH - ANTI-FRAUD LAYER */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Confidential Hidden Ground Truth (Anti-Fraud Secret)</span>
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                Never Shown Publicly
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enter private details known only to the genuine owner (e.g. lock screen wallpaper, hidden serial digit, charger brand in sleeve, inner pocket keys). Gemini uses this to dynamically challenge claimants.
            </p>
            <textarea
              rows={2}
              value={hiddenGroundTruth}
              onChange={(e) => setHiddenGroundTruth(e.target.value)}
              placeholder="e.g. Serial ends in 99X4. Lock screen is red nebula with 'Stay Hungry'. Case contains black Anker charger."
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-cyan-100 placeholder-slate-500 resize-none font-mono"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950 stroke-[3]" />
              <span>Submit Report & Run Proactive AI</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
