# Campus Find (RECOVER-X) — Smart Campus Lost & Found

> **Factual Summary:** Campus Find is a full-stack smart lost-and-found web application built for the PromptWars x YenTech "Build with AI" hackathon. The system enables campus members to submit lost and found reports with photos, descriptions, locations, and timestamps. It uses Google Gemini multimodal (vision + text) AI to evaluate physical hallmarks, categorical specifications, and campus spatial-temporal proximity, generating structured confidence scores with plain-language explanations. The platform includes an AI anti-fraud ownership challenge layer and QR-verified safe handoff protocols at designated campus security zones.

---

## 📋 Challenge Alignment Matrix (PromptWars x YenTech "Build with AI")

This submission explicitly implements and demonstrates every core requirement and differentiator specified in the official hackathon challenge brief:

| # | Challenge Brief Requirement (Exact Wording) | Implementation Status | Implementation Details & File Reference |
|---|---|---|---|
| **1** | *"Users submit lost or found item reports with a photo, description, location, and time."* | ✅ **Fully Implemented** | Interactive intake modal supporting photo uploads, preset samples, category selection, campus location mapping, and timestamps. ([`src/components/ReportModal.jsx`](file:///src/components/ReportModal.jsx)) |
| **2** | *"The system must analyze reports, identify likely matches between lost and found items..."* | ✅ **Fully Implemented** | Google Gemini Multimodal reasoning engine comparing image hallmarks (scratches, stickers, colorimetry) and textual metadata. ([`src/services/geminiService.js`](file:///src/services/geminiService.js)) |
| **3** | *"...output a confidence score..."* | ✅ **Fully Implemented** | Overall weighted percentage score (0–100%) prominently displayed on the match inspection panel. ([`src/components/MatchHub.jsx`](file:///src/components/MatchHub.jsx)) |
| **4** | *"...and explain in plain language why two reports are considered a match."* | ✅ **Fully Implemented** | Plain-language AI Forensic Rationale plus a 4-signal weighted breakdown (Visual 40%, Specs 25%, Proximity 20%, Time 15%). ([`src/components/MatchHub.jsx`](file:///src/components/MatchHub.jsx)) |
| **5** | *"Users can also search and browse all reports."* | ✅ **Fully Implemented** | Real-time search with instant filtering across lost/found types, categories, building locations, and keywords. ([`src/App.jsx`](file:///src/App.jsx)) |
| **6** | *"Differentiator 1: True Multimodal Matching (Vision + Text)"* | ✅ **Fully Implemented** | Sends image data and descriptions directly to Gemini API in a single structured prompt for joint reasoning. ([`src/services/geminiService.js`](file:///src/services/geminiService.js)) |
| **7** | *"Differentiator 2: Explainable, Weighted Confidence Breakdown"* | ✅ **Fully Implemented** | Interactive 4-signal breakdown cards with per-signal scores, progress bars, and evidence chips. ([`src/components/MatchHub.jsx`](file:///src/components/MatchHub.jsx)) |
| **8** | *"Differentiator 3: Claim Verification / Anti-Fraud Layer"* | ✅ **Fully Implemented** | Dynamic AI questions generated from confidential hidden ground truth, scoring claimant responses before releasing contact details. ([`src/components/ClaimVerificationModal.jsx`](file:///src/components/ClaimVerificationModal.jsx)) |
| **9** | *"Differentiator 4: Proactive Push Matching"* | ✅ **Fully Implemented** | Automated background matching triggered on new report submission with real-time push notifications. ([`src/App.jsx`](file:///src/App.jsx)) |
| **10** | *"Differentiator 5: Safe Handoff Workflow"* | ✅ **Fully Implemented** | Supervised campus safe zone selection (Library Desk, Union Kiosk), scannable QR Claim Ticket, and 6-digit verification PIN (`749-102`). ([`src/components/SafeHandoffModal.jsx`](file:///src/components/SafeHandoffModal.jsx)) |
| **11** | *"Differentiator 6: Privacy by Design"* | ✅ **Fully Implemented** | Public reports mask real emails/phones with anonymous handles (`@StudentReyes_44`), revealing info only after verified ownership. ([`src/components/ItemCard.jsx`](file:///src/components/ItemCard.jsx)) |

---

## 🚀 Public Live Deployment & Repository Links

- **GitHub Repository:** [https://github.com/Jawad-mr/RECOVER-X](https://github.com/Jawad-mr/RECOVER-X)
- **Live Public URL:** [https://recover-x.vercel.app](https://recover-x.vercel.app) *(and GitHub Pages: [https://jawad-mr.github.io/RECOVER-X/](https://jawad-mr.github.io/RECOVER-X/))*
- **Local Dev Server:** `http://localhost:5173/`

---

## 🛠️ Step-by-Step Local Setup Instructions

Follow these exact steps to run the application locally from a clean clone:

```bash
# 1. Clone the repository
git clone https://github.com/Jawad-mr/RECOVER-X.git
cd RECOVER-X

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. (Optional) Run production build check
npm run build
npm run preview
```

Open your browser at `http://localhost:5173/`. The app includes pre-seeded test data and runs immediately with zero configuration required.

---

## 🧪 Pre-Seeded Evaluation Test Pairs

The database includes 5 pre-seeded realistic test pairs so evaluators and judges can inspect matches immediately:

| Pair ID | Category | Lost Report | Matching Found Report | Expected Score | Key Corroborated Evidence |
|---|---|---|---|---|---|
| **Pair 1** | **Electronics** | 💻 14" Space Gray MacBook Pro | Space Gray Laptop in Study Carrel #4 | **96% (High Confidence)** | Top-left bezel ding, blue holographic astronaut decal, Library 2nd floor |
| **Pair 2** | **Water Bottles** | 💧 Teal Hydro Flask 32oz | Teal Metal Water Bottle (Gym Court 2) | **94% (High Confidence)** | Matte teal finish, vintage Yosemite mountain decal, rim dent |
| **Pair 3** | **Audio** | 🎧 Sony WH-1000XM4 Silver | Silver Sony Headphones in Black Case | **92% (High Confidence)** | Platinum silver finish, 'AT' headband etching, Student Union lounge |
| **Pair 4** | **Bags & Backpacks** | 🎒 Navy Jansport Backpack | Dark Blue Backpack with Orange Charm | **88% (High Confidence)** | Orange fox enamel keychain, Science Rm 204 laboratory |
| **Pair 5** | **Wallets & Keys** | 👛 Brown Leather Fossil Wallet | Found Bifold Wallet in Dining Hall | **85% (High Confidence)** | Distressed leather, contrast stitching, Dining Hall corridor |

---

## 🤖 Multimodal AI Architecture & Design Decisions

### Live Gemini API + Transparent Neural Heuristic Fallback
1. **Live Gemini Multimodal Calls (`src/services/geminiService.js`):**
   - Connects directly to Google Gemini 1.5 Flash (`generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`).
   - Evaluates visual features from images alongside metadata in a single structured JSON prompt.
   - Evaluates anti-fraud claimant answers against confidential ground truth.
2. **Transparent Neural Heuristic Engine:**
   - If an API key is not supplied or offline, the app executes a localized multi-signal heuristic engine matching the exact Gemini JSON schema.
   - Evaluators can enter a custom Gemini API key at any time via the **Settings** modal in the navigation bar.

---

## 📁 Repository Structure

```
lostfound/
├── .github/workflows/deploy.yml   # Automated GitHub Pages CI/CD workflow
├── index.html                     # HTML5 entry with Plus Jakarta Sans typography
├── package.json                   # Project dependencies and build scripts
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS configuration with campus theme tokens
├── vercel.json                    # Vercel SPA routing and build configuration
├── vite.config.js                 # Vite build and server settings
└── src/
    ├── App.jsx                    # Root application state, proactive push engine, tabs
    ├── index.css                  # Design system, accessible focus rings, scrollbars
    ├── main.jsx                   # React 18 DOM root
    ├── components/
    │   ├── AnalyticsView.jsx      # Campus trust metrics, building hotspots heatmap
    │   ├── ApiKeyModal.jsx        # Google Gemini API key configuration
    │   ├── ClaimVerificationModal.jsx # Dynamic AI anti-fraud ownership challenge
    │   ├── ItemCard.jsx           # Card presentation with privacy shield & hallmarks
    │   ├── ItemDetailsModal.jsx   # Item details inspector with secret truth toggle
    │   ├── JudgeTourModal.jsx     # 60-second pitch guide and architecture overview
    │   ├── MatchHub.jsx           # Multimodal comparison & 4-signal breakdown
    │   ├── Navbar.jsx             # Top bar, notifications, search, quick pitch trigger
    │   ├── ReportModal.jsx        # Intake wizard with Gemini Vision auto-tagger
    │   └── SafeHandoffModal.jsx   # Campus safe zones, QR claim ticket & 6-digit PIN
    ├── data/
    │   └── seedData.js            # Pre-seeded test items, safe zones, campus locations
    └── services/
        └── geminiService.js       # Gemini 1.5/2.0 API client & multimodal engine
```
