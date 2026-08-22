import React, { useState, useMemo, useCallback } from "react";
import {
  Search, Plus, MapPin, Clock, Camera, X, Check, ChevronRight,
  ChevronLeft, AlertCircle, Sparkles, Package, PackageCheck,
  Filter, ArrowLeft, Tag
} from "lucide-react";

// ---------- Design tokens ----------
const COLORS = {
  ink: "#1B2A41",
  inkSoft: "#334862",
  paper: "#F7F5F0",
  paperRaised: "#FFFFFF",
  amber: "#E8A33D",
  amberDeep: "#B9791F",
  sage: "#7FA88E",
  sageDeep: "#4E7360",
  coral: "#C85C3C",
  line: "#E4DED2",
  lineStrong: "#CFC6B4",
};

// ---------- Seed data ----------
const CATEGORIES = ["Electronics", "Bags & Backpacks", "Clothing", "ID & Cards", "Keys", "Books & Notes", "Jewelry & Accessories", "Water Bottles", "Other"];
const LOCATIONS = ["Library - Main Hall", "Library - 2nd Floor Study Rooms", "Student Union", "Science Building Rm 204", "Gym / Athletics Center", "Cafeteria", "Engineering Quad", "Parking Lot C", "Lecture Hall A", "Dorm - Maple Hall"];

let ID_COUNTER = 1000;
const nextId = () => `LF-${ID_COUNTER++}`;

const seedReports = [
  {
    id: nextId(), type: "lost", category: "Electronics",
    title: "Silver MacBook Pro 14\"",
    description: "Space gray MacBook Pro, 14-inch, has a small dent on the top-left corner of the lid and a translucent blue sticker near the Apple logo.",
    location: "Library - 2nd Floor Study Rooms", date: "2026-08-18", time: "14:30",
    color: "Space Gray", brand: "Apple", contact: "j.reyes@campus.edu",
    photoTag: "laptop-dent-sticker", status: "open",
  },
  {
    id: nextId(), type: "found", category: "Electronics",
    title: "Laptop found in study room",
    description: "Found a gray laptop (looks like a MacBook) left on a study room table. Has a small dent on one corner and what looks like a blue sticker near the logo.",
    location: "Library - 2nd Floor Study Rooms", date: "2026-08-18", time: "15:10",
    color: "Gray", brand: "Apple (likely)", contact: "front-desk@library.edu",
    photoTag: "laptop-dent-sticker-found", status: "open",
  },
  {
    id: nextId(), type: "lost", category: "Bags & Backpacks",
    title: "Navy blue Jansport backpack",
    description: "Navy blue backpack with a keychain of a small fox on the front zipper. Contains a chemistry textbook and a red pencil case.",
    location: "Science Building Rm 204", date: "2026-08-19", time: "11:00",
    color: "Navy Blue", brand: "Jansport", contact: "priya.k@campus.edu",
    photoTag: "backpack-fox-keychain", status: "open",
  },
  {
    id: nextId(), type: "found", category: "Keys",
    title: "Set of keys with a fox keychain",
    description: "Found a small set of keys (3 keys, one car key) with a fox-shaped keychain attached, near the science building entrance.",
    location: "Engineering Quad", date: "2026-08-19", time: "11:45",
    color: "Silver", brand: "N/A", contact: "security@campus.edu",
    photoTag: "keys-fox-keychain", status: "open",
  },
  {
    id: nextId(), type: "lost", category: "ID & Cards",
    title: "Student ID card - Marcus T.",
    description: "Lost my student ID card, name Marcus T., photo on front, campus card with a blue stripe.",
    location: "Cafeteria", date: "2026-08-20", time: "12:15",
    color: "Blue/White", brand: "Campus ID", contact: "marcus.t@campus.edu",
    photoTag: "student-id-blue", status: "open",
  },
  {
    id: nextId(), type: "found", category: "Water Bottles",
    title: "Stainless steel water bottle",
    description: "Dented stainless steel bottle, brand Hydro Flask, matte teal color, has a sticker of a mountain on the side.",
    location: "Gym / Athletics Center", date: "2026-08-20", time: "09:00",
    color: "Teal", brand: "Hydro Flask", contact: "gym-desk@campus.edu",
    photoTag: "bottle-teal-mountain", status: "open",
  },
];

// ---------- Lightweight local "AI" matching simulation ----------
// Token-overlap + attribute scoring to simulate an AI matching engine with explainability.
const STOPWORDS = new Set(["the","a","an","of","in","on","at","and","or","with","has","have","near","it","is","was","to","for","my","i","found","lost"]);

function tokenize(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w && !STOPWORDS.has(w));
}

function daysBetween(d1, d2) {
  return Math.abs((new Date(d1) - new Date(d2)) / (1000 * 60 * 60 * 24));
}

function computeMatch(a, b) {
  if (a.type === b.type) return null; // only match lost <-> found
  const lost = a.type === "lost" ? a : b;
  const found = a.type === "lost" ? b : a;

  const reasons = [];
  let score = 0;

  // Category match
  if (lost.category === found.category) {
    score += 28;
    reasons.push({ label: "Same category", detail: `Both tagged "${lost.category}"`, weight: 28 });
  }

  // Text similarity (title + description)
  const lostTokens = new Set([...tokenize(lost.title), ...tokenize(lost.description)]);
  const foundTokens = new Set([...tokenize(found.title), ...tokenize(found.description)]);
  const shared = [...lostTokens].filter(t => foundTokens.has(t));
  const textScore = Math.min(30, shared.length * 5);
  if (shared.length > 0) {
    score += textScore;
    reasons.push({
      label: "Matching description details",
      detail: `Shared terms: ${shared.slice(0, 6).join(", ")}`,
      weight: textScore,
    });
  }

  // Color match
  if (lost.color && found.color && lost.color.toLowerCase().split("/")[0].trim() &&
      found.color.toLowerCase().includes(lost.color.toLowerCase().split("/")[0].trim().split(" ")[0])) {
    score += 15;
    reasons.push({ label: "Color matches", detail: `"${lost.color}" ~ "${found.color}"`, weight: 15 });
  }

  // Brand match
  if (lost.brand && found.brand && lost.brand !== "N/A" && found.brand !== "N/A") {
    const lb = lost.brand.toLowerCase();
    const fb = found.brand.toLowerCase();
    if (lb.includes(fb.split(" ")[0]) || fb.includes(lb.split(" ")[0])) {
      score += 12;
      reasons.push({ label: "Brand matches", detail: `"${lost.brand}" ~ "${found.brand}"`, weight: 12 });
    }
  }

  // Location proximity (exact or same building)
  if (lost.location === found.location) {
    score += 10;
    reasons.push({ label: "Same exact location", detail: lost.location, weight: 10 });
  } else {
    const lb = lost.location.split(" - ")[0];
    const fb = found.location.split(" - ")[0];
    if (lb === fb) {
      score += 5;
      reasons.push({ label: "Same building", detail: `${lb}`, weight: 5 });
    }
  }

  // Time proximity
  const dayDiff = daysBetween(lost.date, found.date);
  if (dayDiff <= 2) {
    const timeScore = dayDiff === 0 ? 10 : dayDiff <= 1 ? 7 : 4;
    score += timeScore;
    reasons.push({
      label: "Reported close in time",
      detail: dayDiff === 0 ? "Same day" : `${Math.round(dayDiff)} day(s) apart`,
      weight: timeScore,
    });
  }

  score = Math.min(99, Math.round(score));
  return { score, reasons: reasons.sort((x, y) => y.weight - x.weight), lost, found };
}

function getAllMatches(reports) {
  const matches = [];
  for (let i = 0; i < reports.length; i++) {
    for (let j = i + 1; j < reports.length; j++) {
      const m = computeMatch(reports[i], reports[j]);
      if (m && m.score >= 30) matches.push(m);
    }
  }
  return matches.sort((a, b) => b.score - a.score);
}

// ---------- UI atoms ----------
function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: COLORS.line, color: COLORS.inkSoft },
    lost: { bg: "#F3DFD6", color: COLORS.coral },
    found: { bg: "#DCEBE2", color: COLORS.sageDeep },
    amber: { bg: "#FBE7C6", color: COLORS.amberDeep },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
      padding: "3px 9px", borderRadius: 20, background: t.bg, color: t.color,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
    }}>{children}</span>
  );
}

function ScoreRing({ score, size = 56 }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 70 ? COLORS.sageDeep : score >= 45 ? COLORS.amberDeep : COLORS.coral;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={COLORS.line} strokeWidth="5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontWeight: 700, fontSize: size * 0.28, color,
      }}>{score}</div>
    </div>
  );
}

function PhotoPlaceholder({ tag, type, size = "normal" }) {
  const dims = size === "small" ? 56 : size === "large" ? 120 : 88;
  const hue = type === "lost" ? COLORS.coral : COLORS.sageDeep;
  return (
    <div style={{
      width: dims, height: dims, borderRadius: 10, flexShrink: 0,
      background: `repeating-linear-gradient(135deg, ${COLORS.line} 0 6px, #EFEAE0 6px 12px)`,
      border: `1px solid ${COLORS.lineStrong}`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 4, position: "relative", overflow: "hidden",
    }}>
      <Camera size={dims * 0.28} color={hue} strokeWidth={1.5} />
      {size !== "small" && (
        <span style={{
          fontSize: 8, fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          color: COLORS.inkSoft, textAlign: "center", padding: "0 4px", lineHeight: 1.2,
        }}>{tag}</span>
      )}
    </div>
  );
}

// ---------- Report Card ----------
function ReportCard({ report, onClick, matchCount }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", gap: 14, padding: 14, background: COLORS.paperRaised,
      border: `1px solid ${COLORS.line}`, borderRadius: 12, cursor: "pointer",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(27,42,65,0.08)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <PhotoPlaceholder tag={report.photoTag} type={report.type} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
          <Badge tone={report.type}>{report.type}</Badge>
          <Badge tone="neutral">{report.category}</Badge>
          {matchCount > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: COLORS.amberDeep }}>
              <Sparkles size={12} /> {matchCount} possible match{matchCount > 1 ? "es" : ""}
            </span>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.ink, marginBottom: 4 }}>{report.title}</div>
        <div style={{ fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.4, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {report.description}
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 12, color: COLORS.inkSoft, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{report.location}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{report.date} · {report.time}</span>
        </div>
      </div>
      <ChevronRight size={18} color={COLORS.lineStrong} style={{ flexShrink: 0, alignSelf: "center" }} />
    </div>
  );
}

// ---------- Match reasoning bar ----------
function ReasonBar({ reason, maxWeight }) {
  const pct = Math.round((reason.weight / maxWeight) * 100);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
        <span style={{ fontWeight: 600, color: COLORS.ink }}>{reason.label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', ui-monospace, monospace", color: COLORS.inkSoft }}>+{reason.weight}</span>
      </div>
      <div style={{ height: 6, background: COLORS.line, borderRadius: 4, overflow: "hidden", marginBottom: 4 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: COLORS.amber, borderRadius: 4, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ fontSize: 12, color: COLORS.inkSoft }}>{reason.detail}</div>
    </div>
  );
}

// ---------- Match detail panel ----------
function MatchPanel({ match, onBack }) {
  const maxWeight = Math.max(...match.reasons.map(r => r.weight), 1);
  return (
    <div>
      <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={15} /> Back to matches</button>
      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "18px 0 24px" }}>
        <ScoreRing score={match.score} size={72} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: COLORS.amberDeep, marginBottom: 4 }}>
            {match.score >= 70 ? "Strong potential match" : match.score >= 45 ? "Possible match" : "Weak match"}
          </div>
          <div style={{ fontSize: 15, color: COLORS.inkSoft }}>Confidence score based on {match.reasons.length} matching signal{match.reasons.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[match.lost, match.found].map((r, i) => (
          <div key={i} style={{ background: COLORS.paperRaised, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 14 }}>
            <Badge tone={r.type}>{r.type}</Badge>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <PhotoPlaceholder tag={r.photoTag} type={r.type} size="small" />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: COLORS.ink, marginBottom: 3 }}>{r.title}</div>
                <div style={{ fontSize: 11.5, color: COLORS.inkSoft, display: "flex", alignItems: "center", gap: 3 }}>
                  <MapPin size={11} />{r.location}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.paperRaised, border: `1px solid ${COLORS.line}`, borderRadius: 12, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 14, marginBottom: 14, color: COLORS.ink }}>
          <Sparkles size={15} color={COLORS.amberDeep} /> Why the AI thinks this matches
        </div>
        {match.reasons.map((r, i) => <ReasonBar key={i} reason={r} maxWeight={maxWeight} />)}
      </div>
    </div>
  );
}

const backBtnStyle = {
  display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
  color: COLORS.inkSoft, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0,
};

// ---------- Report detail with its matches ----------
function ReportDetail({ report, allReports, onBack }) {
  const matches = useMemo(() => {
    return allReports
      .filter(r => r.id !== report.id && r.type !== report.type)
      .map(r => computeMatch(report, r))
      .filter(m => m && m.score >= 25)
      .sort((a, b) => b.score - a.score);
  }, [report, allReports]);

  const [selectedMatch, setSelectedMatch] = useState(null);

  if (selectedMatch) {
    return <MatchPanel match={selectedMatch} onBack={() => setSelectedMatch(null)} />;
  }

  return (
    <div>
      <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={15} /> Back to reports</button>
      <div style={{ display: "flex", gap: 16, margin: "18px 0 20px" }}>
        <PhotoPlaceholder tag={report.photoTag} type={report.type} size="large" />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <Badge tone={report.type}>{report.type}</Badge>
            <Badge tone="neutral">{report.category}</Badge>
          </div>
          <div style={{ fontWeight: 700, fontSize: 19, color: COLORS.ink, marginBottom: 8 }}>{report.title}</div>
          <div style={{ fontSize: 13.5, color: COLORS.inkSoft, lineHeight: 1.5 }}>{report.description}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        <InfoRow icon={<MapPin size={14} />} label="Location" value={report.location} />
        <InfoRow icon={<Clock size={14} />} label="Date & time" value={`${report.date} · ${report.time}`} />
        <InfoRow icon={<Tag size={14} />} label="Color" value={report.color} />
        <InfoRow icon={<Package size={14} />} label="Brand" value={report.brand} />
      </div>

      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 6, color: COLORS.ink }}>
        <Sparkles size={15} color={COLORS.amberDeep} />
        {matches.length > 0 ? `${matches.length} potential match${matches.length > 1 ? "es" : ""} found` : "No potential matches yet"}
      </div>

      {matches.length === 0 && (
        <div style={{ padding: 24, textAlign: "center", color: COLORS.inkSoft, fontSize: 13, background: COLORS.paperRaised, border: `1px dashed ${COLORS.lineStrong}`, borderRadius: 12 }}>
          The AI will keep scanning new reports for matches against this one.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {matches.map((m, i) => {
          const other = m.lost.id === report.id ? m.found : m.lost;
          return (
            <div key={i} onClick={() => setSelectedMatch(m)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: 12,
              background: COLORS.paperRaised, border: `1px solid ${COLORS.line}`, borderRadius: 12, cursor: "pointer",
            }}>
              <ScoreRing score={m.score} size={44} />
              <PhotoPlaceholder tag={other.photoTag} type={other.type} size="small" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 3 }}>
                  <Badge tone={other.type}>{other.type}</Badge>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: COLORS.ink }}>{other.title}</div>
                <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>{other.location}</div>
              </div>
              <ChevronRight size={16} color={COLORS.lineStrong} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: COLORS.paperRaised, border: `1px solid ${COLORS.line}`, borderRadius: 10 }}>
      <span style={{ color: COLORS.amberDeep }}>{icon}</span>
      <div>
        <div style={{ fontSize: 10.5, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.03em", fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 13, color: COLORS.ink, fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

// ---------- Submit form ----------
function SubmitForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    type: "lost", category: CATEGORIES[0], title: "", description: "",
    location: LOCATIONS[0], date: new Date().toISOString().slice(0, 10),
    time: "12:00", color: "", brand: "", contact: "",
  });
  const [error, setError] = useState("");
  const [photoAttached, setPhotoAttached] = useState(false);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim() || !form.description.trim() || !form.contact.trim()) {
      setError("Fill in the item title, description, and contact info first.");
      return;
    }
    setError("");
    onSubmit({
      ...form,
      id: nextId(),
      photoTag: photoAttached ? "user-upload" : "no-photo",
      status: "open",
    });
  };

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${COLORS.lineStrong}`,
    fontSize: 13.5, background: COLORS.paperRaised, color: COLORS.ink, fontFamily: "inherit",
    boxSizing: "border-box",
  };
  const labelStyle = { fontSize: 11.5, fontWeight: 700, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 5, display: "block" };

  return (
    <div>
      <button onClick={onCancel} style={backBtnStyle}><ArrowLeft size={15} /> Cancel</button>
      <div style={{ fontWeight: 700, fontSize: 19, color: COLORS.ink, margin: "16px 0 4px" }}>Submit a report</div>
      <div style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 20 }}>Add as much detail as you can — the AI matcher uses every field to find likely matches.</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["lost", "found"].map(t => (
          <button key={t} onClick={() => update("type", t)} style={{
            flex: 1, padding: "12px", borderRadius: 10, cursor: "pointer",
            border: `2px solid ${form.type === t ? (t === "lost" ? COLORS.coral : COLORS.sageDeep) : COLORS.line}`,
            background: form.type === t ? (t === "lost" ? "#F3DFD6" : "#DCEBE2") : COLORS.paperRaised,
            color: form.type === t ? (t === "lost" ? COLORS.coral : COLORS.sageDeep) : COLORS.inkSoft,
            fontWeight: 700, fontSize: 13, textTransform: "capitalize",
          }}>{t === "lost" ? "I lost something" : "I found something"}</button>
        ))}
      </div>

      <div onClick={() => setPhotoAttached(v => !v)} style={{
        display: "flex", alignItems: "center", gap: 10, padding: 12, marginBottom: 16,
        border: `1.5px dashed ${photoAttached ? COLORS.sageDeep : COLORS.lineStrong}`, borderRadius: 10, cursor: "pointer",
        background: photoAttached ? "#DCEBE2" : "transparent",
      }}>
        <Camera size={18} color={photoAttached ? COLORS.sageDeep : COLORS.inkSoft} />
        <span style={{ fontSize: 13, fontWeight: 600, color: photoAttached ? COLORS.sageDeep : COLORS.inkSoft }}>
          {photoAttached ? "Photo attached (simulated)" : "Attach a photo"}
        </span>
        {photoAttached && <Check size={16} color={COLORS.sageDeep} style={{ marginLeft: "auto" }} />}
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Item title</label>
        <input style={inputStyle} placeholder="e.g. Black North Face jacket" value={form.title} onChange={e => update("title", e.target.value)} />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Include distinguishing details: stickers, scratches, contents, keychains..."
          value={form.description} onChange={e => update("description", e.target.value)} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Category</label>
          <select style={inputStyle} value={form.category} onChange={e => update("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Location</label>
          <select style={inputStyle} value={form.location} onChange={e => update("location", e.target.value)}>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Date</label>
          <input type="date" style={inputStyle} value={form.date} onChange={e => update("date", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Time</label>
          <input type="time" style={inputStyle} value={form.time} onChange={e => update("time", e.target.value)} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Color</label>
          <input style={inputStyle} placeholder="e.g. Navy blue" value={form.color} onChange={e => update("color", e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Brand (optional)</label>
          <input style={inputStyle} placeholder="e.g. Jansport" value={form.brand} onChange={e => update("brand", e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={labelStyle}>Contact email</label>
        <input style={inputStyle} placeholder="you@campus.edu" value={form.contact} onChange={e => update("contact", e.target.value)} />
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.coral, fontSize: 12.5, marginBottom: 14 }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <button onClick={handleSubmit} style={{
        width: "100%", padding: "13px", borderRadius: 10, border: "none", cursor: "pointer",
        background: COLORS.ink, color: COLORS.paper, fontWeight: 700, fontSize: 14,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <Sparkles size={15} /> Submit & run AI match
      </button>
    </div>
  );
}

// ---------- Main App ----------
export default function App() {
  const [reports, setReports] = useState(seedReports);
  const [view, setView] = useState("browse"); // browse | detail | submit | submitted
  const [selectedReport, setSelectedReport] = useState(null);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [justSubmitted, setJustSubmitted] = useState(null);
  const [submittedMatches, setSubmittedMatches] = useState([]);

  const allMatches = useMemo(() => getAllMatches(reports), [reports]);

  const matchCountFor = useCallback((report) => {
    return allMatches.filter(m => m.lost.id === report.id || m.found.id === report.id).length;
  }, [allMatches]);

  const filtered = useMemo(() => {
    let list = reports;
    if (filterType !== "all") list = list.filter(r => r.type === filterType);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => (a.date + a.time < b.date + b.time ? 1 : -1));
  }, [reports, query, filterType]);

  const handleSubmit = (newReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    const matches = updated
      .filter(r => r.id !== newReport.id && r.type !== newReport.type)
      .map(r => computeMatch(newReport, r))
      .filter(m => m && m.score >= 25)
      .sort((a, b) => b.score - a.score);
    setJustSubmitted(newReport);
    setSubmittedMatches(matches);
    setView("submitted");
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: COLORS.paper, minHeight: "100vh", color: COLORS.ink,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { outline: 2px solid ${COLORS.amber}; outline-offset: 1px; }
        ::placeholder { color: #A8A196; }
      `}</style>

      {/* Header */}
      <div style={{ background: COLORS.ink, padding: "20px 20px 60px" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PackageCheck size={18} color={COLORS.ink} />
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, color: COLORS.paper, letterSpacing: "-0.01em" }}>Campus Find</div>
          </div>
          <div style={{ fontSize: 12.5, color: "#A8B5C4" }}>AI-matched lost & found for your campus</div>
        </div>
      </div>

      {/* Content card */}
      <div style={{ maxWidth: 480, margin: "-40px auto 0", padding: "0 16px 100px" }}>
        <div style={{ background: COLORS.paper, borderRadius: 20, padding: "20px 18px 24px", boxShadow: "0 -2px 0 rgba(0,0,0,0.02)" }}>

          {view === "browse" && (
            <>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Search size={15} color={COLORS.inkSoft} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                  <input
                    value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search reports..."
                    style={{
                      width: "100%", padding: "10px 12px 10px 34px", borderRadius: 10,
                      border: `1px solid ${COLORS.line}`, fontSize: 13.5, background: COLORS.paperRaised,
                      boxSizing: "border-box", color: COLORS.ink,
                    }}
                  />
                </div>
                <button onClick={() => setView("submit")} style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "0 16px", borderRadius: 10,
                  border: "none", background: COLORS.amber, color: COLORS.ink, fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}>
                  <Plus size={16} /> Report
                </button>
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[["all", "All"], ["lost", "Lost"], ["found", "Found"]].map(([val, label]) => (
                  <button key={val} onClick={() => setFilterType(val)} style={{
                    padding: "6px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                    border: `1px solid ${filterType === val ? COLORS.ink : COLORS.line}`,
                    background: filterType === val ? COLORS.ink : "transparent",
                    color: filterType === val ? COLORS.paper : COLORS.inkSoft,
                  }}>{label}</button>
                ))}
              </div>

              {allMatches.length > 0 && (
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", marginBottom: 16,
                  background: "#FBE7C6", borderRadius: 10, fontSize: 12.5, color: COLORS.amberDeep, fontWeight: 600,
                }}>
                  <Sparkles size={14} />
                  {allMatches.length} potential match{allMatches.length > 1 ? "es" : ""} detected across all reports
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.inkSoft, fontSize: 13 }}>
                    No reports match your search.
                  </div>
                )}
                {filtered.map(r => (
                  <ReportCard key={r.id} report={r} matchCount={matchCountFor(r)}
                    onClick={() => { setSelectedReport(r); setView("detail"); }} />
                ))}
              </div>
            </>
          )}

          {view === "detail" && selectedReport && (
            <ReportDetail report={selectedReport} allReports={reports} onBack={() => setView("browse")} />
          )}

          {view === "submit" && (
            <SubmitForm onSubmit={handleSubmit} onCancel={() => setView("browse")} />
          )}

          {view === "submitted" && justSubmitted && (
            <div>
              <div style={{ textAlign: "center", padding: "12px 0 24px" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", background: "#DCEBE2", display: "flex",
                  alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
                }}>
                  <Check size={26} color={COLORS.sageDeep} />
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Report submitted</div>
                <div style={{ fontSize: 13, color: COLORS.inkSoft }}>
                  Report ID <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{justSubmitted.id}</span> is now live.
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={15} color={COLORS.amberDeep} />
                {submittedMatches.length > 0 ? `The AI found ${submittedMatches.length} potential match${submittedMatches.length > 1 ? "es" : ""}` : "No matches found yet"}
              </div>

              {submittedMatches.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: COLORS.inkSoft, fontSize: 13, background: COLORS.paperRaised, border: `1px dashed ${COLORS.lineStrong}`, borderRadius: 12, marginBottom: 20 }}>
                  We'll keep checking as new reports come in.
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {submittedMatches.map((m, i) => {
                  const other = m.lost.id === justSubmitted.id ? m.found : m.lost;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: COLORS.paperRaised, border: `1px solid ${COLORS.line}`, borderRadius: 12 }}>
                      <ScoreRing score={m.score} size={44} />
                      <PhotoPlaceholder tag={other.photoTag} type={other.type} size="small" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Badge tone={other.type}>{other.type}</Badge>
                        <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 3 }}>{other.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={() => { setSelectedReport(justSubmitted); setView("detail"); }} style={{
                width: "100%", padding: "12px", borderRadius: 10, border: `1px solid ${COLORS.ink}`,
                background: "transparent", color: COLORS.ink, fontWeight: 700, fontSize: 13.5, cursor: "pointer", marginBottom: 10,
              }}>View full report & matches</button>
              <button onClick={() => setView("browse")} style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: COLORS.ink, color: COLORS.paper, fontWeight: 700, fontSize: 13.5, cursor: "pointer",
              }}>Back to all reports</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
