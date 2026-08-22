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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateBack}
            className={`p-2 rounded-lg border transition-colors ${
              darkMode ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white" : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
            }`}
            title="Back to Overview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Report an Item
            </h1>
            <p className="text-xs text-zinc-400">
              Submit a report to initiate multi-signal radar matching
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
          reportType === "lost" ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-emerald-950 text-emerald-300 border border-emerald-800"
        }`}>
          {reportType === "lost" ? "LOST REPORT" : "FOUND REPORT"}
        </span>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className={`p-6 rounded-2xl border space-y-5 ${
        darkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"
      }`}>
        
        {/* Type Selector */}
        <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl border ${
          darkMode ? "bg-black border-zinc-850" : "bg-zinc-100 border-zinc-200"
        }`}>
          <button
            type="button"
            onClick={() => setReportType("lost")}
            className={`py-2 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors ${
              reportType === "lost"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>I Lost An Item</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType("found")}
            className={`py-2 rounded-lg font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors ${
              reportType === "found"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>I Found An Item</span>
          </button>
        </div>

        {/* Photo Gallery Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-zinc-300">
            Select Sample Item Photo:
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DEMO_PRESET_PHOTOS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-2 rounded-xl border text-left flex flex-col items-center text-xs transition-colors ${
                  imageUrl === preset.url
                    ? "bg-zinc-900 border-white ring-1 ring-white"
                    : "bg-black border-zinc-850 hover:border-zinc-700"
                }`}
              >
                <img 
                  src={preset.url} 
                  alt={preset.title}
                  className="w-full h-14 rounded-lg object-cover mb-1.5" 
                />
                <span className="text-[10px] font-mono text-zinc-300 line-clamp-1 text-center">
                  {preset.title.split(" ")[0]} {preset.title.split(" ")[1]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Preview & AI Extractor */}
        <div className="p-3.5 rounded-xl bg-black border border-zinc-850 space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <img 
                src={imageUrl} 
                alt="Item preview" 
                className="w-12 h-12 rounded-lg object-cover border border-zinc-800" 
              />
              <div>
                <h4 className="text-xs font-semibold text-white">Visual Hallmark Scanner</h4>
                <p className="text-[11px] text-zinc-400 font-mono">Scans scratches, stickers, decals, and geometry</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzingImage}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingImage ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingImage ? "Scanning..." : "Scan Photo"}</span>
            </button>
          </div>

          {aiAnalysisCompleted && visualFeatures && (
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs space-y-1 animate-fade-in font-mono">
              <span className="text-zinc-400 font-bold text-[10px] uppercase">Detected Hallmarks:</span>
              <p className="text-zinc-200 font-sans text-xs">{visualFeatures}</p>
            </div>
          )}
        </div>

        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 14-inch Space Gray MacBook Pro"
              className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-xs text-white focus:border-zinc-500 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">
            Description *
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe visible scratches, colors, case..."
            className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 resize-none focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Location & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Location *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-2.5 py-2 bg-black border border-zinc-800 rounded-lg text-xs text-white focus:border-zinc-500 focus:outline-none"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-2.5 py-2 bg-black border border-zinc-800 rounded-lg text-xs text-white focus:border-zinc-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-2.5 py-2 bg-black border border-zinc-800 rounded-lg text-xs text-white focus:border-zinc-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Confidential Ground Truth */}
        <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Private Verification Secret (Hidden)</span>
            </label>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              ENCRYPTED
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 leading-snug">
            Private detail known only to owner (e.g. lock screen text, serial digits, keychain count). Used to challenge claimants.
          </p>
          <textarea
            rows={2}
            value={hiddenGroundTruth}
            onChange={(e) => setHiddenGroundTruth(e.target.value)}
            placeholder="e.g. Lock screen wallpaper text, serial ending in 99X4..."
            className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 resize-none font-mono focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-2 flex items-center justify-end space-x-2.5 border-t border-zinc-850">
          <button
            type="button"
            onClick={onNavigateBack}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors"
          >
            Submit Report
          </button>
        </div>

      </form>

    </div>
  );
}
