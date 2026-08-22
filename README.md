# RECOVER-X — Smart Lost & Found System

> **PromptWars x YenTech • Google for Developers "Build with AI" Hackathon**  
> **Repository:** [https://github.com/Jawad-mr/RECOVER-X](https://github.com/Jawad-mr/RECOVER-X)  
> **Live Deployment:** [https://recover-x-sandy.vercel.app](https://recover-x-sandy.vercel.app) • [https://jawad-mr.github.io/RECOVER-X/](https://jawad-mr.github.io/RECOVER-X/)

---

## 📌 Executive Summary

RECOVER-X is an AI-powered lost and found platform built for university campuses to accelerate item recovery and eliminate ownership fraud. Users submit lost or found reports containing photos, descriptions, campus locations, timestamps, and optional confidential ground-truth details. The system analyzes submissions using multimodal reasoning to calculate an explainable, 4-signal confidence score (Visual Similarity 40%, Specs 25%, Campus Location 20%, Time 15%) and outputs plain-language matching explanations. To ensure security before handoff, RECOVER-X features dynamic ownership verification challenges, supervised campus safe handoff tickets with scannable QR codes, and printable privacy-preserving device safe-tags.

---

## 🎯 Problem Statement Alignment Matrix

| Challenge Brief Requirement (Verbatim) | RECOVER-X Implementation Feature | Source Code Location | Status |
|---|---|---|---|
| **1. "Users submit lost or found item reports with a photo, description, location, and time."** | Dedicated intake form (`ReportPage.jsx`) supporting lost/found mode toggles, photo presets/uploads with visual hallmark scanning, campus building dropdowns, date & time inputs, and private ownership secrets. | [`src/components/ReportPage.jsx`](file:///src/components/ReportPage.jsx) | **100% Implemented & Tested** |
| **2. "The system must analyze reports, identify likely matches between lost and found items..."** | Multimodal side-by-side comparator (`MatchHub.jsx`) and background push notification engine cross-referencing surface hallmarks, specification text, and geospatial corridors. | [`src/services/geminiService.js`](file:///src/services/geminiService.js) & [`src/components/MatchHub.jsx`](file:///src/components/MatchHub.jsx) | **100% Implemented & Tested** |
| **3. "...output a confidence score..."** | Monospace confidence score counter displaying weighted multi-signal scores with corresponding confidence tier badges (`HIGH_CONFIDENCE`, `MODERATE_MATCH`, `LOW_LIKELIHOOD`, `NO_MATCH`). | [`src/components/MatchHub.jsx`](file:///src/components/MatchHub.jsx) | **100% Implemented & Tested** |
| **4. "...and explain in plain language why two reports are considered a match."** | Forensic rationale card summarizing matched physical evidence chips (e.g. *Astronaut sticker motif*, *teal powder coat*, *National park decal*) and location corridors. | [`src/components/MatchHub.jsx`](file:///src/components/MatchHub.jsx) | **100% Implemented & Tested** |
| **5. "Users can also search and browse all reports."** | Full-text search bar with live filtering by report type (*All*, *Lost Only*, *Found Only*), category dropdowns, and interactive campus building hotspot cards. | [`src/App.jsx`](file:///src/App.jsx) & [`src/components/ItemCard.jsx`](file:///src/components/ItemCard.jsx) | **100% Implemented & Tested** |

---

## 🌐 Google Services Used

- **Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`)** ([`src/services/geminiService.js`](file:///src/services/geminiService.js)):
  - **Multimodal Visual Hallmark Analysis (`analyzeUploadedImage`):** Identifies surface markings, decals, scratches, and colorimetry from uploaded item images.
  - **Comparative Matcher (`runMultimodalMatch`):** Evaluates visual and textual correspondence across lost and found pairs to generate weighted scores and forensic summaries.
  - **Anti-Fraud Question Synthesis (`generateAntiFraudQuestions`):** Synthesizes ownership questions from confidential ground truth without exposing answers.
  - **Claimant Answer Evaluator (`evaluateClaimantAnswers`):** Semantically scores claimant answers against stored ground truth to verify ownership.
- **Google Fonts (`Plus Jakarta Sans` / `Google Sans`)**:
  - High-legibility typography optimized for accessible UI layouts.

---

## 🛠️ Complete Feature Inventory (Currently Working)

1. **System Boot Sequence & Capabilities Showcase (`IntroSplashScreen.jsx`):**
   - 4-stage simulated boot sequence displaying AI module initialization with instant skip and replay controls in the sidebar.
2. **Campus Explorer Feed & Discovery (`App.jsx`, `ItemCard.jsx`):**
   - Real-time search across titles, descriptions, brands, colors, and locations with memoized filter evaluation.
   - Filter by report type (*Lost*, *Found*, *All*) and category.
3. **Interactive Campus Hotspots Map (`CampusMapScanner.jsx`):**
   - Displays real-time lost and found counts across 4 key campus facilities (*Central Library*, *Science Complex*, *Athletics Center*, *Student Union*) with one-click filtering.
4. **Report Intake Workflow (`ReportPage.jsx`):**
   - Lost and found submission forms with photo presets, automatic hallmark extraction, campus zone selectors, and private ground-truth secrets.
5. **AI Multi-Signal Match Hub (`MatchHub.jsx`):**
   - Side-by-side visual comparator with 4 pre-seeded evaluation pairs and customizable selectors.
   - 4-signal weighted breakdown: Visual Surface Match (40%), Model & Specs (25%), Campus Proximity (20%), Timeline Delta (15%).
6. **Anti-Fraud Ownership Challenge Modal (`ClaimVerificationModal.jsx`):**
   - Generates contextual questions from private report ground truth.
   - Evaluates claimant answers and produces a verification confidence score with pass/fail thresholds.
   - Includes sample response buttons for demonstration (*Genuine Owner Sample* vs *Invalid Guess Sample*).
7. **Supervised Safe Handoff Vault (`SafeHandoffModal.jsx`):**
   - Generates 6-digit handoff PINs and scannable QR claim tickets for designated campus safety kiosks.
   - Confirms handoff and updates item status in the local ledger with celebratory confetti.
8. **Digital QR Safe-Tag Generator (`SmartTagModal.jsx`):**
   - Creates printable, privacy-preserving QR recovery tags for student devices and backpacks.
9. **Campus Metrics Intelligence (`AnalyticsView.jsx`):**
   - Real-time reporting statistics, match precision percentages, and safe zone operational statuses.
10. **Dual Theme Engine (Google Material Dark & Light):**
    - High-contrast Google Material Dark (`#121212` / `#202124`) and Light (`#f8fafd` / `#ffffff`) modes with instant toggle.

---

## 🧪 Automated Test Suite

RECOVER-X includes an automated unit test suite executed using Node's native test runner (`node --test`):

```bash
# Run automated tests
npm test
```

### Test Cases Covered:
- ✅ **Test 1: Clear High-Confidence Match Case** — Confirms `MacBook Pro 14"` vs. `Found Laptop w/ Astronaut Sticker` yields score $\ge 75\%$ with visual and location breakdowns.
- ✅ **Test 2: Clear Non-Match Case** — Confirms `MacBook Pro` vs. `Hydro Flask` yields score $< 40\%$ and tier `NO_MATCH`.
- ✅ **Test 3: Malformed/Empty Input Edge Case** — Confirms empty strings and missing fields are handled safely with bounded scores ($0-100\%$) and zero runtime exceptions.
- ✅ **Test 4: Anti-Fraud Claim Verification** — Confirms genuine claimant answers receive `VERIFIED` status while incorrect answers receive `FAILED` status.

---

## 💻 Local Development & Installation

### Prerequisites
- Node.js 18+
- npm 9+

### Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/Jawad-mr/RECOVER-X.git
cd RECOVER-X

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional)
cp .env.example .env
# Set VITE_GEMINI_API_KEY if making live API calls; otherwise local neural engine runs automatically.

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

---

## 👥 Pre-Seeded Evaluation Pairs

For evaluator convenience, RECOVER-X comes pre-populated with realistic campus test pairs:

| Preset Name | Lost Item | Found Item | Target Expected Match | Key Forensic Identifiers |
|---|---|---|---|---|
| **MacBook Pro** | REP-9001 (MacBook Pro 14") | REP-9002 (Laptop w/ Sticker) | **96% (High Confidence)** | Holographic astronaut sticker, corner ding, Library 2nd floor |
| **Hydro Flask** | REP-9003 (Teal Hydro Flask) | REP-9004 (Tumbler w/ Decal) | **94% (High Confidence)** | Teal powder coat, national park decal, Athletics bleachers |
| **Sony XM4** | REP-9005 (Sony WH-1000XM4) | REP-9006 (Black Headphones) | **92% (High Confidence)** | Gold logo accents, headband scuff, Science Hall lobby |
| **Jansport Fox** | REP-9007 (Jansport Backpack) | REP-9008 (Navy Backpack w/ Charm) | **89% (High Confidence)** | Embroidered fox keychain, zipper wear, Student Union cafe |
