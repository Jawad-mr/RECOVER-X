import test from "node:test";
import assert from "node:assert/strict";
import { runMultimodalMatch, evaluateClaimantAnswers } from "../src/services/geminiService.js";
import { INITIAL_REPORTS } from "../src/data/seedData.js";

test("Multimodal AI Matcher - Clear High-Confidence Match Case", async () => {
  const lostMacBook = INITIAL_REPORTS[0];
  const foundMacBook = INITIAL_REPORTS[1];

  const result = await runMultimodalMatch(lostMacBook, foundMacBook, "");
  
  assert.ok(result, "Result object should exist");
  assert.ok(result.overallScore >= 75, `Expected score >= 75, got ${result.overallScore}`);
  assert.ok(result.summaryReason.length > 10, "Should have plain-language summary reason");
  assert.ok(result.breakdown.visualSimilarity.score >= 70, "Visual similarity score should be high");
  assert.ok(result.breakdown.locationProximity.score >= 70, "Location proximity score should be high");
});

test("Multimodal AI Matcher - Clear Non-Match Case", async () => {
  const lostMacBook = INITIAL_REPORTS[0]; // Electronics
  const foundFlask = INITIAL_REPORTS[3];   // Water Bottle

  const result = await runMultimodalMatch(lostMacBook, foundFlask, "");
  
  assert.ok(result, "Result object should exist");
  assert.ok(result.overallScore < 40, `Expected non-match score < 40, got ${result.overallScore}`);
  assert.equal(result.matchTier, "NO_MATCH", "Match tier should be NO_MATCH");
});

test("Multimodal AI Matcher - Edge Case: Malformed or Empty Input", async () => {
  const malformedLost = { id: "ERR-1", title: "", category: "", location: "" };
  const malformedFound = { id: "ERR-2", title: "", category: "", location: "" };

  const result = await runMultimodalMatch(malformedLost, malformedFound, "");
  
  assert.ok(result, "Result object should exist even with empty strings");
  assert.ok(typeof result.overallScore === "number", "Overall score should be a valid number");
  assert.ok(result.overallScore >= 0 && result.overallScore <= 100, "Score should remain bounded between 0 and 100");
});

test("Anti-Fraud Verification Engine - Legitimate vs Imposter Claim Evaluation", async () => {
  const laptopItem = INITIAL_REPORTS[0];
  const questions = [
    { id: "q_wallpaper", question: "What is the lock screen wallpaper?" }
  ];

  // Legitimate claimant answers matching hidden ground truth
  const goodAnswers = { q_wallpaper: "red space nebula wallpaper with 'Stay Hungry'" };
  const goodResult = await evaluateClaimantAnswers(questions, goodAnswers, laptopItem, "");
  assert.ok(goodResult.verificationScore >= 70, "Legitimate owner should pass verification");
  assert.equal(goodResult.verdict, "VERIFIED", "Legitimate owner should be VERIFIED");

  // Imposter claimant guess
  const badAnswers = { q_wallpaper: "a generic beach ocean picture" };
  const badResult = await evaluateClaimantAnswers(questions, badAnswers, laptopItem, "");
  assert.ok(badResult.verificationScore < 50, "Imposter guess should fail verification");
  assert.equal(badResult.verdict, "FAILED", "Imposter should be FAILED");
});
