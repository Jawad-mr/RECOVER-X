# 🎓 Campus Find (RECOVER-X) — Smart Campus Lost & Found
> **Award-Winning Multimodal AI Lost & Found Ecosystem with Anti-Fraud Verification**  
> *Built for PromptWars x YenTech • Google for Developers "Build with AI" Hackathon*

---

## ⚡ 60-Second Hackathon Pitch

> *"Traditional lost & found boards fail because they rely on brittle keyword matching and have zero fraud prevention—anyone can claim an expensive laptop or earbuds. **Campus Find (RECOVER-X)** replaces this with **True Multimodal Gemini AI Reasoning**: our system passes photos and descriptions directly to Google Gemini to reason simultaneously over physical damage, stickers, colorimetry, and campus geospatial corridors. Crucially, we introduced an industry-first **AI Anti-Fraud Verification Layer**: Gemini generates dynamic challenge questions from confidential report secrets (like lockscreen wallpapers or inner pocket contents) and scores claimants before releasing contact or handoff credentials. From proactive push alerts to QR-verified campus safe-zones, Campus Find delivers an end-to-end trusted recovery loop."*

---

## 🌟 Key Differentiating Features

### 1. 🔍 True Multimodal Vision + Text AI Matching
- Unlike basic keyword matching, Campus Find sends both photos and descriptions to Google's Gemini Vision API.
- The model performs forensic reasoning across:
  - **Visual Surface Indicators:** Holographic stickers, corner dings, scratches, powder coats, and specific charms.
  - **Categorical & Model Specs:** M2 14" chassis, Hydro Flask 32oz flex caps, XM4 over-ear cushions.
  - **Geospatial Corridors:** Spatial proximity across campus buildings (Library Study Rooms, STEM Quad, Cafeteria).
  - **Temporal Delta:** Time coincidence within academic class schedules.

### 2. 📊 Explainable Weighted Confidence Breakdown
Never a black box. Every match produces an interactive 4-signal breakdown:
- **Visual Similarity (40% Weight):** Reasoning over image hallmarks.
- **Description & Specs (25% Weight):** Model, size, color, brand.
- **Geospatial Proximity (20% Weight):** Building connectivity and foot traffic paths.
- **Temporal Delta (15% Weight):** Time elapsed between loss and discovery.
- **Key Visual Evidence Chips:** Highlights corroborated physical proof.

### 3. 🛡️ AI Anti-Fraud Claim Verification Layer (The Novel Innovation)
- Solves the critical trust gap in campus recovery where imposters attempt to claim high-value items.
- At report creation, users enter **Confidential Hidden Ground Truth** (e.g. *"Lockscreen shows deep space red nebula with 'Stay Hungry'. Case contains 65W Anker charger in side zip"*).
- When a claim is initiated, Gemini formulates 2-3 dynamic ownership challenge questions **without revealing the answers**.
- Gemini scores the claimant's answers against the hidden truth and only unlocks handoff info if the verification score meets the threshold ($\ge 75\%$).

### 4. 🔔 Proactive Push Matching Engine
- Not just on-demand search: whenever a new report is logged, a background worker evaluates it against opposite-type reports and triggers real-time in-app alerts and notifications.

### 5. 🤝 Safe Handoff Protocol & Claim Ticket (QR Code)
- Closing the loop end-to-end:
  - Select verified, supervised **Campus Safe Zones** (Central Library Information Desk, Student Union Welcome Kiosk, Athletics Desk).
  - Generates an encrypted digital **Claim Ticket with Scannable QR Code** and **6-Digit Verification PIN** (`749-102`).
  - Dual confirmation marks the item officially **Resolved** with campus karma rewards.

### 6. 🔒 Privacy by Design
- Real emails and phone numbers remain masked with anonymous student handles (e.g. `@StudentReyes_44`). Contact data is only revealed after passing the Anti-Fraud AI verification.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Canvas-Confetti
- **Multimodal AI Reasoning:** Google Gemini 1.5 Flash / Gemini 2.0 API (`generativelanguage.googleapis.com`) + Hybrid Neural Fallback Engine
- **Geospatial & Campus Safety:** Verified Campus Safe Zones and building taxonomy
- **Security & Privacy:** Masked handles, client-side secret encryption, anti-fraud challenge verifier

---

## 🚀 Quick Start & Live Testing

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Jawad-mr/RECOVER-X.git
cd RECOVER-X

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 🧪 Judge Evaluation Presets (Pre-Seeded Test Pairs)

| # | Item Category | Lost Item Report | Matching Found Report | Expected Score |
|---|---|---|---|---|
| 1 | **Electronics** | 💻 14" Space Gray MacBook Pro (Astronaut sticker + ding) | Space Gray Laptop in Study Carrel #4 | **96% (High Confidence)** |
| 2 | **Water Bottles** | 💧 Teal Hydro Flask 32oz (Yosemite decal + dent) | Teal Metal Water Bottle (Gym Court 2) | **94% (High Confidence)** |
| 3 | **Audio** | 🎧 Sony WH-1000XM4 Silver (AT headband etching) | Silver Sony Headphones in Case | **92% (High Confidence)** |
| 4 | **Bags** | 🎒 Navy Jansport Backpack (Fox keychain) | Dark Blue Backpack with Orange Charm | **88% (High Confidence)** |
| 5 | **Wallets** | 👛 Brown Leather Fossil Wallet (Folded $20 bill) | Found Bifold Wallet in Dining Hall | **85% (High Confidence)** |

---

## 🏆 Hackathon Submission Checklist

- [x] True Multimodal Vision + Text AI reasoning directly via Gemini
- [x] Explainable, weighted confidence breakdown (Visual, Specs, Location, Time)
- [x] Dynamic Anti-Fraud Verification challenge from hidden ground truth
- [x] Proactive Push Matching radar on new report submissions
- [x] Safe Handoff protocol with QR Claim Ticket and campus safe zones
- [x] Privacy-by-design masked handles
- [x] 60-second interactive Judge Tour modal
- [x] Full browser E2E verification completed with zero errors
