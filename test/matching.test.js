import test from "node:test";
import assert from "node:assert/strict";
import { 
  runMultimodalMatch, 
  evaluateClaimantAnswers, 
  generateAntiFraudQuestions,
  analyzeUploadedImage
} from "../src/services/geminiService.js";
import { INITIAL_REPORTS, CATEGORIES, CAMPUS_LOCATIONS } from "../src/data/seedData.js";

test("1. Multimodal AI Matcher - Clear High-Confidence Match Case", async () => {
  const lostMacBook = INITIAL_REPORTS[0];
  const foundMacBook = INITIAL_REPORTS[1];

  const result = await runMultimodalMatch(lostMacBook, foundMacBook, "");
  
  assert.ok(result, "Result object should exist");
  assert.ok(result.overallScore >= 75, `Expected score >= 75, got ${result.overallScore}`);
  assert.equal(result.matchTier, "HIGH_CONFIDENCE", "Match tier should be HIGH_CONFIDENCE");
  assert.ok(result.summaryReason.length > 15, "Should have plain-language forensic summary reason");
  assert.ok(result.breakdown.visualSimilarity.score >= 70, "Visual similarity score should be high");
  assert.ok(result.breakdown.descriptionSimilarity.score >= 70, "Description similarity score should be high");
  assert.ok(result.breakdown.locationProximity.score >= 70, "Location proximity score should be high");
  assert.ok(result.breakdown.timeProximity.score >= 70, "Time proximity score should be high");
});

test("2. Multimodal AI Matcher - Clear Non-Match Case (Different Category & Spec)", async () => {
  const lostMacBook = INITIAL_REPORTS[0]; // Electronics
  const foundFlask = INITIAL_REPORTS[3];   // Water Bottle

  const result = await runMultimodalMatch(lostMacBook, foundFlask, "");
  
  assert.ok(result, "Result object should exist");
  assert.ok(result.overallScore < 40, `Expected non-match score < 40, got ${result.overallScore}`);
  assert.equal(result.matchTier, "NO_MATCH", "Match tier should be NO_MATCH");
});

test("3. Multimodal AI Matcher - Moderate/Partial Match Case (Same Category, Different Hallmarks)", async () => {
  const lostItem = {
    id: "TEST-L1",
    title: "Black Backpack",
    category: "Backpacks",
    brand: "Generic",
    color: "Black",
    location: "Central Library",
    date: "2026-08-20",
    imageVisualFeatures: "Standard black zipper, no patches"
  };
  const foundItem = {
    id: "TEST-F1",
    title: "Navy Blue Backpack",
    category: "Backpacks",
    brand: "Generic",
    color: "Blue",
    location: "Student Union",
    date: "2026-08-21",
    imageVisualFeatures: "Blue strap, subtle wear"
  };

  const result = await runMultimodalMatch(lostItem, foundItem, "");
  assert.ok(result.overallScore >= 40 && result.overallScore <= 80, `Expected moderate score between 40-80, got ${result.overallScore}`);
});

test("4. Multimodal AI Matcher - Edge Case: Malformed or Empty Input", async () => {
  const malformedLost = { id: "ERR-1", title: "", category: "", location: "" };
  const malformedFound = { id: "ERR-2", title: "", category: "", location: "" };

  const result = await runMultimodalMatch(malformedLost, malformedFound, "");
  
  assert.ok(result, "Result object should exist even with empty strings");
  assert.ok(typeof result.overallScore === "number", "Overall score should be a valid number");
  assert.ok(result.overallScore >= 0 && result.overallScore <= 100, "Score should remain bounded between 0 and 100");
  assert.ok(result.breakdown, "Breakdown structure should be intact");
});

test("5. Anti-Fraud Question Generation - Synthesizes Contextual Questions", async () => {
  const laptopItem = INITIAL_REPORTS[0];
  const qData = await generateAntiFraudQuestions(laptopItem, "");

  assert.ok(qData, "Questions payload should exist");
  assert.ok(Array.isArray(qData.questions), "Should return an array of questions");
  assert.ok(qData.questions.length >= 1, "Should generate at least 1 challenge question");
  assert.ok(qData.questions[0].id, "Question item must have an ID");
  assert.ok(qData.questions[0].question.length > 5, "Question string must be descriptive");
});

test("6. Anti-Fraud Claim Verification - Legitimate Owner Verification", async () => {
  const laptopItem = INITIAL_REPORTS[0];
  const questions = [
    { id: "q_wallpaper", question: "What is the lock screen wallpaper?" },
    { id: "q_accessories", question: "What accessories are in the case?" }
  ];

  const goodAnswers = { 
    q_wallpaper: "red space nebula wallpaper with 'Stay Hungry'",
    q_accessories: "Anker GaN fast charger with black cable"
  };
  const goodResult = await evaluateClaimantAnswers(questions, goodAnswers, laptopItem, "");
  
  assert.ok(goodResult.verificationScore >= 70, `Expected score >= 70, got ${goodResult.verificationScore}`);
  assert.equal(goodResult.verdict, "VERIFIED", "Legitimate owner should be VERIFIED");
  assert.equal(goodResult.fraudRiskLevel, "LOW", "Risk level should be LOW");
  assert.equal(goodResult.unlockedHandoffEligible, true, "Handoff ticket should be unlocked");
});

test("7. Anti-Fraud Claim Verification - Imposter Guess Evaluation", async () => {
  const laptopItem = INITIAL_REPORTS[0];
  const questions = [
    { id: "q_wallpaper", question: "What is the lock screen wallpaper?" }
  ];

  const badAnswers = { q_wallpaper: "a generic beach ocean picture" };
  const badResult = await evaluateClaimantAnswers(questions, badAnswers, laptopItem, "");
  
  assert.ok(badResult.verificationScore < 50, `Expected score < 50, got ${badResult.verificationScore}`);
  assert.equal(badResult.verdict, "FAILED", "Imposter should be FAILED");
  assert.equal(badResult.unlockedHandoffEligible, false, "Handoff ticket must NOT be unlocked");
});

test("8. Anti-Fraud Claim Verification - Empty Input Handling", async () => {
  const laptopItem = INITIAL_REPORTS[0];
  const questions = [
    { id: "q_wallpaper", question: "What is the lock screen wallpaper?" }
  ];

  const emptyAnswers = {};
  const emptyResult = await evaluateClaimantAnswers(questions, emptyAnswers, laptopItem, "");
  
  assert.equal(emptyResult.verdict, "FAILED", "Empty answers must fail verification");
  assert.equal(emptyResult.unlockedHandoffEligible, false, "Handoff ticket must remain locked");
});

test("9. Image Hallmark Scanner - Heuristic Visual Analysis Fallback", async () => {
  const analysis = await analyzeUploadedImage("https://images.unsplash.com/photo-1517336714731-489689fd1ca8", "");
  
  assert.ok(analysis, "Analysis object should exist");
  assert.ok(analysis.visualFeatures, "Visual features should be extracted");
  assert.ok(analysis.color, "Color property should be detected");
});

test("10. Data Integrity - Seed Data & Location Corridors Consistency", () => {
  assert.ok(INITIAL_REPORTS.length >= 8, "Should have at least 8 pre-seeded realistic reports");
  assert.ok(CATEGORIES.length >= 5, "Should support multiple campus categories");
  assert.ok(CAMPUS_LOCATIONS.length >= 4, "Should cover major campus zones");
  
  INITIAL_REPORTS.forEach(report => {
    assert.ok(report.id.startsWith("REP-"), `Report ID must follow format, got ${report.id}`);
    assert.ok(report.type === "lost" || report.type === "found", "Type must be lost or found");
    assert.ok(report.title.length > 0, "Title cannot be empty");
    assert.ok(report.location.length > 0, "Location cannot be empty");
  });
});
