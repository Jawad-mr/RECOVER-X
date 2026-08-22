import React, { useState } from "react";
import { 
  Plus, Camera, Sparkles, MapPin, Clock, Shield, 
  Lock, Check, Image as ImageIcon, RefreshCw, CheckCircle2, ArrowLeft
} from "lucide-react";
import { CATEGORIES, CAMPUS_LOCATIONS, DEMO_PRESET_PHOTOS } from "../data/seedData";
import { analyzeUploadedImage } from "../services/geminiService";

export default function ReportPage({ 
  onSubmitReport,
  onNavigateBack,
  darkMode
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
      const analysis = await analyzeUploadedImage(imageUrl, "");
      if (analysis) {
        if (analysis.color) setColor(analysis.color);
        if (analysis.brand) setBrand(analysis.brand);
        if (analysis.visualFeatures) setVisualFeatures(analysis.visualFeatures);
        if (analysis.suggestedDescription && !description) setDescription(analysis.suggestedDescription);
        setAiAnalysisCompleted(true);
      }
    } catch (err) {
      console.error("Image analysis error:", err);
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
      reporterName: "Campus Member",
      contactEmail: "member@campus.edu",
      contactPhone: "+1 (555) 019-2819",
      status: "open",
      createdAt: new Date().toISOString(),
      isPreSeeded: false
    };

    onSubmitReport(newReport);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateBack}
            className={`p-2.5 rounded-xl border transition-colors ${
              darkMode ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
            }`}
            title="Back to Explorer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Report an Item
            </h1>
            <p className={`mt-0.5 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Submit a lost or found report to automatically trigger visual matching across campus
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className={`px-3 py-1 rounded-full font-bold ${
            reportType === "lost" ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-emerald-950 text-emerald-300 border border-emerald-800"
          }`}>
            {reportType === "lost" ? "• Lost Item Form" : "• Found Item Form"}
          </span>
        </div>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
        darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}>
        
        {/* Report Type Selector */}
        <div className={`grid grid-cols-2 gap-3 p-1.5 rounded-2xl border ${
          darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"
        }`}>
          <button
            type="button"
            onClick={() => setReportType("lost")}
            className={`py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              reportType === "lost"
                ? "bg-rose-600 text-white shadow-md"
                : darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span>I LOST Something</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType("found")}
            className={`py-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              reportType === "found"
                ? "bg-emerald-600 text-white shadow-md"
                : darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span>I FOUND Something</span>
          </button>
        </div>

        {/* Sample Photo Gallery Selector */}
        <div className="space-y-2">
          <label className={`block text-xs font-bold uppercase tracking-wider ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}>
            Select or Upload Item Photo:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {DEMO_PRESET_PHOTOS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-2xl border text-left flex flex-col items-center text-xs transition-all ${
                  imageUrl === preset.url
                    ? "bg-slate-800 border-emerald-500 ring-2 ring-emerald-500 shadow-md"
                    : darkMode ? "bg-slate-950 border-slate-800 hover:bg-slate-800/80" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <img 
                  src={preset.url} 
                  alt={preset.title}
                  className="w-full h-16 rounded-xl object-cover mb-2" 
                />
                <span className="text-[11px] font-bold line-clamp-1 text-center">
                  {preset.title.split(" ")[0]} {preset.title.split(" ")[1]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Preview & Visual Hallmark Extractor */}
        <div className={`p-5 rounded-2xl border space-y-3 ${
          darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <img 
                src={imageUrl} 
                alt="Item preview" 
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700/60" 
              />
              <div>
                <h4 className="text-xs font-bold">Image & Hallmark Analysis</h4>
                <p className={`text-[11px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Scans surface damage, stickers, scratches, and geometry
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzingImage}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center space-x-2 transition-colors"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzingImage ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingImage ? "Analyzing..." : "Scan & Extract Details"}</span>
            </button>
          </div>

          {aiAnalysisCompleted && visualFeatures && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/60 text-xs space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Detected Visual Hallmarks:</span>
              </div>
              <p className="font-medium leading-relaxed">
                "{visualFeatures}"
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-semibold text-emerald-300">
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">Color: {color || 'Detected'}</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">Brand: {brand || 'Detected'}</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">Category: {category}</span>
              </div>
            </div>
          )}
        </div>

        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 14-inch Space Gray MacBook Pro"
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-emerald-500 ${
                darkMode ? "bg-slate-950 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-emerald-500 ${
                darkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Public Description */}
        <div>
          <label className="block text-xs font-bold uppercase mb-1.5">
            Public Description *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe visible color, stickers, dents, condition..."
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border resize-none focus:outline-none focus:border-emerald-500 ${
              darkMode ? "bg-slate-950 border-slate-700 text-white placeholder-slate-500" : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Location & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase mb-1.5">
              Campus Location *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-emerald-500 ${
                darkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-emerald-500 ${
                darkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1.5">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium border focus:outline-none focus:border-emerald-500 ${
                darkMode ? "bg-slate-950 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
              }`}
            />
          </div>
        </div>

        {/* Confidential Ground Truth - Anti-Fraud Layer */}
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${
          darkMode ? "bg-slate-950 border-cyan-800/80" : "bg-cyan-50/50 border-cyan-300"
        }`}>
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-500 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-cyan-500" />
              <span>Confidential Security Secret (Hidden from Public)</span>
            </label>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              Private
            </span>
          </div>
          <p className={`text-[11px] leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Enter private details known only to the genuine owner (e.g. lock screen wallpaper, hidden serial digit, charger brand in sleeve, inner pocket keys). Used to challenge claimants.
          </p>
          <textarea
            rows={2}
            value={hiddenGroundTruth}
            onChange={(e) => setHiddenGroundTruth(e.target.value)}
            placeholder="e.g. Serial ends in 99X4. Lock screen is red nebula with 'Stay Hungry'. Case contains black Anker charger."
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs resize-none font-mono focus:outline-none border ${
              darkMode ? "bg-slate-900 border-slate-700 text-cyan-100 placeholder-slate-500" : "bg-white border-slate-300 text-cyan-900 placeholder-slate-400"
            }`}
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onNavigateBack}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Submit Report</span>
          </button>
        </div>

      </form>

    </div>
  );
}
