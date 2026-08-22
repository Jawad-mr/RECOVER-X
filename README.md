# RECOVER-X — Smart Lost & Found System

> **PromptWars x YenTech • Google for Developers "Build with AI" Hackathon**  
> **Repository:** [https://github.com/Jawad-mr/RECOVER-X](https://github.com/Jawad-mr/RECOVER-X)  
> **Live Deployment:** [https://jawad-mr.github.io/RECOVER-X/](https://jawad-mr.github.io/RECOVER-X/)

---

## 📌 3-Sentence Executive Summary
**RECOVER-X** is an enterprise-grade Smart Lost & Found web platform engineered to solve campus item loss through true multimodal AI reasoning and zero-knowledge ownership verification. Powered by Google Gemini Vision & Text APIs, the system automatically analyzes physical hallmarks (scratches, stickers, dents, and colorimetry) alongside geospatial proximity to generate explainable, weighted confidence scores (40% Visual, 25% Specs, 20% Location, 15% Time). To eliminate fraud and protect student privacy, RECOVER-X introduces dynamic anti-fraud ownership challenges and supervised campus safe handoff kiosks with encrypted QR claim tickets.

---

## 🎯 Challenge Brief Alignment Matrix

| Challenge Brief Requirement (Verbatim) | RECOVER-X Implementation Feature | Source Code Location | Verification Status |
|---|---|---|---|
| **1. "Users submit lost or found item reports with a photo, description, location, and time."** | Dedicated full-page intake form (`ReportPage.jsx`) supporting lost/found toggles, photo selection with AI hallmark extraction, campus zone dropdowns, timestamps, and confidential private ground-truth fields. | [`src/components/ReportPage.jsx`](file:///src/components/ReportPage.jsx) | ✅ **100% Implemented & Verified** |
| **2. "The system must analyze reports, identify likely matches between lost and found items..."** | Proactive background radar matching and side-by-side multimodal comparative analysis cross-referencing visual surface hallmarks, specifications, and geospatial coordinates. | [`src/services/geminiService.js`](file:///src/services/geminiService.js) | ✅ **100% Implemented & Verified** |
| **3. "...output a confidence score..."** | Prominent animated percentage gauge calculating a weighted score across 4 distinct signals (40% Visual, 25% Specs, 20% Location, 15% Time). | [`src/components/MatchHub.jsx`](file:///src/components/MatchHub.jsx) | ✅ **100% Implemented & Verified** |
| **4. "...and explain in plain language why two reports are considered a match."** | Plain-language forensic rationale card summarizing corroborated evidence chips (e.g. *Astronaut sticker motif*, *teal powder coat*, *National Park decal*). | [`src/components/MatchHub.jsx`](file:///src/components/MatchHub.jsx) | ✅ **100% Implemented & Verified** |
| **5. "Users can also search and browse all reports."** | Instant full-text search bar with live filtering by report type (*Lost Only*, *Found Only*, *All*), category dropdowns, and interactive campus building hotspot clicks. | [`src/App.jsx`](file:///src/App.jsx) & [`src/components/ItemCard.jsx`](file:///src/components/ItemCard.jsx) | ✅ **100% Implemented & Verified** |

---

## 🌐 Google Services Used

- **Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`)**:
  - Multimodal Vision Reasoning: Evaluates physical scratches, custom stickers, dents, and colorimetry from item photos.
  - Semantic Specification Matcher: Computes text embedding similarity across brands, models, and descriptions.
  - Dynamic Anti-Fraud Question Generator: Synthesizes contextual challenge questions from confidential ground truth without leaking answers.
  - Claimant Answer Evaluator: Semantically compares claimant submissions against hidden ground truth to compute verification confidence.
- **Google Fonts (`Plus Jakarta Sans`)**:
  - High-readability modern typography optimized for data-dense interfaces and accessibility.

---

## 🛡️ Key Innovations & Differentiators

1. **True Multimodal AI Matching**: Evaluates physical hallmarks (damage, custom stickers, dents) rather than shallow keyword matching.
2. **Explainable 4-Signal Confidence Breakdown**: Visual Similarity (40%), Item Specs (25%), Campus Location (20%), Time Delta (15%).
3. **Anti-Fraud Ownership Challenge**: Prevents false claims by dynamically asking claimants about hidden details (e.g. wallpaper text, inner pocket contents) stored securely in report ground truth.
4. **Digital QR Safe-Tags**: Printable privacy-preserving QR recovery tags for student laptops, bottles, and backpacks.
5. **Supervised Safe Handoff Protocol**: Encrypted 6-digit PIN and scannable QR claim tickets paired with verified campus drop zones (Library, Union, Athletics).

---

## 🧪 Automated Testing Suite

RECOVER-X includes an automated test suite covering clear match cases, non-match cases, edge cases (malformed input), and anti-fraud validation:

```bash
# Run test suite
npm test
```

### Test Coverage Summary:
- ✅ **Test 1:** Multimodal AI Matcher — Clear High-Confidence Match Case (`score >= 75%`, breakdown verified)
- ✅ **Test 2:** Multimodal AI Matcher — Clear Non-Match Case (`score < 40%`, tier `NO_MATCH`)
- ✅ **Test 3:** Multimodal AI Matcher — Edge Case (Malformed/empty strings handled safely)
- ✅ **Test 4:** Anti-Fraud Verification Engine — Legitimate Owner (Pass) vs. Imposter (Failed)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/Jawad-mr/RECOVER-X.git
cd RECOVER-X
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
# Add your Gemini API key in .env if running live Google Cloud requests
```

### 3. Run Locally
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 👥 Pre-Seeded Evaluation Test Pairs

| Pair ID | Lost Report | Found Report | Expected Score | Forensic Highlights |
|---|---|---|---|---|
| **Pair 1** | REP-9001 (MacBook Pro 14") | REP-9002 (Laptop w/ Astronaut Sticker) | **96% (High)** | Holographic astronaut sticker, corner ding, Library 2nd floor |
| **Pair 2** | REP-9003 (Teal Hydro Flask) | REP-9004 (Tumbler w/ Mountain Decal) | **94% (High)** | Teal powder coat, national park decal, Athletics bleachers |
| **Pair 3** | REP-9005 (Sony WH-1000XM4) | REP-9006 (Black Headphones in Case) | **92% (High)** | Gold logo accents, headband scuff, Science Hall lobby |
| **Pair 4** | REP-9007 (Jansport Fox Backpack) | REP-9008 (Navy Backpack w/ Fox Charm) | **89% (High)** | Embroidered fox keychain, zipper wear, Student Union cafe |
