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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#3c4043]">
        <div className="flex items-center space-x-3">
          <button
            onClick={onNavigateBack}
            className={`p-2 rounded-full border transition-colors ${
              darkMode ? "bg-[#2d2f31] border-[#3c4043] text-white hover:bg-[#3c4043]" : "bg-white border-[#dadce0] text-[#202124] hover:bg-[#f1f3f4]"
            }`}
            title="Back to Explorer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Report an Item
            </h1>
            <p className="text-xs text-[#9aa0a6]">
              Submit a lost or found report to automatically trigger visual matching
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          reportType === "lost" ? "bg-[#ea4335]/20 text-[#f28b82] border border-[#ea4335]/40" : "bg-[#34a853]/20 text-[#81c995] border border-[#34a853]/40"
        }`}>
          {reportType === "lost" ? "• Lost Item Form" : "• Found Item Form"}
        </span>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
        darkMode ? "bg-[#202124] border-[#3c4043]" : "bg-white border-[#dadce0]"
      }`}>
        
        {/* Type Selector */}
        <div className={`grid grid-cols-2 gap-3 p-1.5 rounded-full border ${
          darkMode ? "bg-[#121212] border-[#3c4043]" : "bg-[#f1f3f4] border-[#dadce0]"
        }`}>
          <button
            type="button"
            onClick={() => setReportType("lost")}
            className={`py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              reportType === "lost"
                ? "bg-[#ea4335] text-white shadow-md"
                : "text-[#9aa0a6] hover:text-white"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span>I LOST Something</span>
          </button>

          <button
            type="button"
            onClick={() => setReportType("found")}
            className={`py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
              reportType === "found"
                ? "bg-[#34a853] text-white shadow-md"
                : "text-[#9aa0a6] hover:text-white"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            <span>I FOUND Something</span>
          </button>
        </div>

        {/* Photo Gallery Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase text-[#bdc1c6]">
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
                    ? "bg-[#1a73e8]/20 border-[#8ab4f8] ring-2 ring-[#8ab4f8]"
                    : "bg-[#121212] border-[#3c4043] hover:border-[#5f6368]"
                }`}
              >
                <img 
                  src={preset.url} 
                  alt={preset.title}
                  className="w-full h-16 rounded-xl object-cover mb-2" 
                />
                <span className="text-[11px] font-bold text-white line-clamp-1 text-center">
                  {preset.title.split(" ")[0]} {preset.title.split(" ")[1]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Preview & AI Extractor */}
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#3c4043] space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <img 
                src={imageUrl} 
                alt="Item preview" 
                className="w-16 h-16 rounded-2xl object-cover border border-[#3c4043]" 
              />
              <div>
                <h4 className="text-xs font-bold text-white">Visual Hallmark Scanner</h4>
                <p className="text-[11px] text-[#9aa0a6]">Scans surface scratches, decals, stickers, and colorimetry</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyzeWithAI}
              disabled={isAnalyzingImage}
              className="px-4 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-md"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzingImage ? 'animate-spin' : ''}`} />
              <span>{isAnalyzingImage ? "Scanning..." : "Scan & Extract Details"}</span>
            </button>
          </div>

          {aiAnalysisCompleted && visualFeatures && (
            <div className="p-3.5 rounded-xl bg-[#34a853]/15 border border-[#34a853]/40 text-xs text-[#e8eaed] space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-[#81c995] font-bold text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Detected Visual Hallmarks:</span>
              </div>
              <p className="font-medium leading-relaxed">
                "{visualFeatures}"
              </p>
            </div>
          )}
        </div>

        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#bdc1c6] mb-1.5">
              Item Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 14-inch Space Gray MacBook Pro"
              className="w-full px-4 py-2.5 bg-[#121212] border border-[#3c4043] rounded-xl text-xs text-white placeholder-[#9aa0a6] focus:border-[#4285F4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#bdc1c6] mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#121212] border border-[#3c4043] rounded-xl text-xs text-white focus:border-[#4285F4] focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase text-[#bdc1c6] mb-1.5">
            Public Description *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe visible color, stickers, dents, condition..."
            className="w-full px-4 py-2.5 bg-[#121212] border border-[#3c4043] rounded-xl text-xs text-white placeholder-[#9aa0a6] resize-none focus:border-[#4285F4] focus:outline-none"
          />
        </div>

        {/* Location & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase text-[#bdc1c6] mb-1.5">
              Campus Location *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#121212] border border-[#3c4043] rounded-xl text-xs text-white focus:border-[#4285F4] focus:outline-none"
            >
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#bdc1c6] mb-1.5">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#121212] border border-[#3c4043] rounded-xl text-xs text-white focus:border-[#4285F4] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#bdc1c6] mb-1.5">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#121212] border border-[#3c4043] rounded-xl text-xs text-white focus:border-[#4285F4] focus:outline-none"
            />
          </div>
        </div>

        {/* Confidential Ground Truth */}
        <div className="p-4 rounded-2xl bg-[#121212] border border-[#4285F4]/40 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-[#8ab4f8] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>Private Verification Secret (Hidden from Public)</span>
            </label>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a73e8]/20 text-[#8ab4f8] border border-[#1a73e8]/40 font-bold">
              Protected
            </span>
          </div>
          <p className="text-[11px] text-[#9aa0a6] leading-relaxed">
            Private details known only to genuine owner (e.g. lock screen text, serial digits, keychain count). Used to challenge claimants.
          </p>
          <textarea
            rows={2}
            value={hiddenGroundTruth}
            onChange={(e) => setHiddenGroundTruth(e.target.value)}
            placeholder="e.g. Lock screen wallpaper is red nebula with 'Stay Hungry'. Case contains black charger."
            className="w-full px-4 py-2 bg-[#1e1f20] border border-[#3c4043] rounded-xl text-xs text-white placeholder-[#5f6368] resize-none font-mono focus:border-[#4285F4] focus:outline-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-3 flex items-center justify-end space-x-3 border-t border-[#3c4043]">
          <button
            type="button"
            onClick={onNavigateBack}
            className="px-5 py-2.5 rounded-full text-xs font-bold text-[#bdc1c6] hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-7 py-3 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Submit Report</span>
          </button>
        </div>

      </form>

    </div>
  );
}
