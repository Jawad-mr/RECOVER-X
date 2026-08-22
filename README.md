# Campus Find — Smart Campus Lost & Found

Built for the **PromptWars x YenTech / Google for Developers "Build with AI"** challenge.

## Challenge recap

Lost and found items on campus are hard to reconnect with their owners: descriptions
vary, information is incomplete, and manually cross-checking reports is slow. This app
lets people submit **lost** or **found** item reports (photo, description, location,
time), and an AI matching engine cross-references reports to surface likely matches
with a **confidence score** and a **plain-language explanation** of why two reports
were matched. Users can also **search and browse** all open reports.

## What's included

- **Submit a report** — lost or found, with category, description, location, date/time,
  color, brand, contact, and a simulated photo attachment.
- **AI matching engine** (`computeMatch` / `getAllMatches` in `src/App.jsx`) — scores every
  lost report against every found report using:
  - Category match
  - Text-overlap similarity between titles/descriptions (shared distinguishing words)
  - Color match
  - Brand match
  - Location match (exact location, or same building)
  - Time proximity (same day / within 1–2 days)
- **Confidence score (0–99)** shown as a ring indicator, color-coded by strength.
- **"Why this matches" breakdown** — every scoring signal is shown as a labeled,
  weighted bar with the specific detail that triggered it (e.g. "Shared terms: fox,
  keychain, keys"), so the match is fully explainable, not a black box.
- **Search & browse** — filter by lost/found, free-text search across title,
  description, location, and category.
- **Report detail view** — shows a single report plus all of its potential matches,
  ranked by confidence.

## Matching design (this build)

This version uses a **transparent, rule-based local scoring engine** instead of a live
LLM call, so it runs instantly with zero API keys or cost — ideal for a demo/hackathon
submission. The scoring logic is isolated in one function (`computeMatch`), so it's a
drop-in swap for a real AI call: replace the body of `computeMatch` with a request to
an LLM (e.g. Claude) that takes both report objects and returns `{ score, reasons }` in
the same shape, and the entire UI (score rings, reasoning bars, match lists) works
unchanged.

### Swapping in a real LLM for matching (optional upgrade path)

```js
// Replace computeMatch's body with something like:
async function computeMatch(lost, found) {
  const res = await fetch('/api/match', {
    method: 'POST',
    body: JSON.stringify({ lost, found }),
  });
  return res.json(); // { score, reasons: [{label, detail, weight}] }
}
```
On the backend, prompt an LLM with both reports' text + attributes and ask it to
return a JSON confidence score plus a short list of matching reasons — the same shape
already used here.

## Running it locally

```bash
npm install
npm run dev
```
Then open the printed local URL (typically `http://localhost:5173`).

To build a static production bundle:
```bash
npm run build
npm run preview
```

## Project structure

```
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx      # React entry point
    └── App.jsx       # Entire app: UI, seed data, matching engine
```

## Notes for the demo / submission

- Seed data ships with 6 sample reports (3 lost/found pairs) so matches are visible
  immediately on load — no setup required to demo the matching feature.
- Photos are simulated as placeholder tiles (labeled by a "photo tag") since this
  environment has no image upload/storage backend; the UI and data model are already
  shaped to swap in real uploaded images (`report.photoTag` → `report.photoUrl`).
- All matching logic, scoring weights, and reasons are visible and editable in
  `computeMatch()` in `src/App.jsx` — good starting point to explain the "AI" logic
  during judging/demo.
