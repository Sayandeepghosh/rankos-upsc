import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { calculateMastery } from "../src/lib/mastery/calculator";
import { calculateNextRevision, calculateRevisionHealth } from "../src/lib/scheduling/spaced-repetition";
import { computeTaskPriority, resolveBacklogItem } from "../src/lib/scheduling/daily-commander";
import { evaluateMCQAttempt } from "../src/lib/prelims/marking";
import { calculatePrelimsReadiness } from "../src/lib/analytics/readiness";
import { MainsEvaluationSchema } from "../src/lib/ai/provider";

describe("RankOS Core Preparation Engine Tests", () => {
  // Test 1: Topic Mastery Engine
  test("calculateMastery computes weighted score and decay properly", () => {
    const freshMastery = calculateMastery({
      recallScore: 80,
      testScore: 80,
      answerScore: 80,
      revisionHealth: 80,
      pyqPerformance: 80,
      lastStudiedAt: new Date(),
    });
    assert.equal(freshMastery.masteryScore, 80);
    assert.equal(freshMastery.confidence, "High");
    assert.equal(freshMastery.decayApplied, 0);

    // Decay test: unrevised for 30 days
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    const decayedMastery = calculateMastery({
      recallScore: 80,
      testScore: 80,
      answerScore: 80,
      revisionHealth: 80,
      pyqPerformance: 80,
      lastStudiedAt: pastDate,
    });
    assert.ok(decayedMastery.decayApplied > 0, "Decay should be applied past 7 days");
    assert.ok(decayedMastery.masteryScore < 80, "Decayed mastery should be lower");
  });

  // Test 2: Spaced Repetition Engine
  test("calculateNextRevision adapts intervals to feedback correctly", () => {
    // Forgot resets to 1 day
    const forgotResult = calculateNextRevision(16, "Forgot");
    assert.equal(forgotResult.newIntervalDays, 1);
    assert.equal(forgotResult.recallHealth, 25);

    // Good progresses intervals
    const goodResult1 = calculateNextRevision(1, "Good");
    assert.equal(goodResult1.newIntervalDays, 3);

    const goodResult2 = calculateNextRevision(3, "Good");
    assert.equal(goodResult2.newIntervalDays, 7);

    // Easy extends aggressively
    const easyResult = calculateNextRevision(7, "Easy");
    assert.equal(easyResult.newIntervalDays, 25);
    assert.equal(easyResult.recallHealth, 100);
  });

  test("calculateRevisionHealth drops health when overdue", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const overdueHealth = calculateRevisionHealth(pastDate);
    assert.ok(overdueHealth < 100, "Overdue items should have health penalty");
  });

  // Test 3: Prelims Marking and Elimination
  test("evaluateMCQAttempt enforces UPSC negative marking", () => {
    // Correct GS-1 attempt
    const correctAttempt = evaluateMCQAttempt({
      isCorrect: true,
      paper: "GS-1",
      eliminationMethod: "Knew directly",
      timeTakenSec: 40,
    });
    assert.equal(correctAttempt.marksObtained, 2.0);
    assert.equal(correctAttempt.isNegative, false);

    // Incorrect GS-1 attempt with penalty
    const incorrectAttempt = evaluateMCQAttempt({
      isCorrect: false,
      paper: "GS-1",
      eliminationMethod: "Eliminated two",
      timeTakenSec: 45,
    });
    assert.equal(incorrectAttempt.marksObtained, -0.66);
    assert.equal(incorrectAttempt.isNegative, true);

    // CSAT correct and incorrect
    const csatCorrect = evaluateMCQAttempt({
      isCorrect: true,
      paper: "CSAT",
      eliminationMethod: "Knew directly",
      timeTakenSec: 60,
    });
    assert.equal(csatCorrect.marksObtained, 2.5);

    const csatIncorrect = evaluateMCQAttempt({
      isCorrect: false,
      paper: "CSAT",
      eliminationMethod: "Blind guess",
      timeTakenSec: 20,
    });
    assert.equal(csatIncorrect.marksObtained, -0.83);
  });

  // Test 4: Daily Commander Priority and Backlog
  test("computeTaskPriority flags urgent high-yield items", () => {
    const urgentTask = computeTaskPriority({
      examImportance: 90,
      isWeakTopic: true,
      revisionUrgent: true,
      pyqFrequency: 12,
      isBacklog: false,
    });
    assert.equal(urgentTask.priorityLabel, "Urgent");
    assert.ok(urgentTask.score >= 80);

    const regularTask = computeTaskPriority({
      examImportance: 50,
      isWeakTopic: false,
      revisionUrgent: false,
      pyqFrequency: 1,
      isBacklog: false,
    });
    assert.notEqual(regularTask.priorityLabel, "Urgent");
  });

  test("resolveBacklogItem protects user from backlog pileup", () => {
    const highYieldAction = resolveBacklogItem({
      importance: "High",
      daysOverdue: 3,
      masteryScore: 40,
    });
    assert.equal(highYieldAction.action, "Reschedule");

    const staleLowYieldAction = resolveBacklogItem({
      importance: "Low",
      daysOverdue: 16,
      masteryScore: 30,
    });
    assert.equal(staleLowYieldAction.action, "Drop");

    const highMasteryAction = resolveBacklogItem({
      importance: "Medium",
      daysOverdue: 4,
      masteryScore: 80,
    });
    assert.equal(highMasteryAction.action, "Drop");
  });

  // Test 5: Readiness Scoring
  test("calculatePrelimsReadiness returns itemized factors", () => {
    const readiness = calculatePrelimsReadiness({
      syllabusCoveragePct: 65,
      mcqAccuracy: 75,
      mockAverageScore: 110,
      revisionHealth: 85,
      pyqsAttemptedPct: 70,
    });
    assert.ok(readiness.score >= 70);
    assert.equal(readiness.band, "Competitive");
    assert.ok(readiness.positiveFactors.length > 0);
  });

  // Test 6: AI Schema Validation
  test("MainsEvaluationSchema validates correct structured data", () => {
    const validData = {
      overallScore: 6.5,
      maxMarks: 10,
      understandingScore: 7.0,
      structureScore: 7.0,
      dimensionsScore: 6.5,
      constitutionScore: 6.0,
      examplesDataScore: 6.5,
      conclusionScore: 6.0,
      strengths: ["Clear intro", "Constitutional citation"],
      majorWeaknesses: ["Missing 2nd ARC"],
      missingDimensions: ["Inter-state council friction"],
      betterStructure: "1. Intro -> 2. Body -> 3. Conclusion",
      enrichmentPoints: ["Article 200", "S.R. Bommai"],
      modelAnswer: "Model outline here",
    };

    const parsed = MainsEvaluationSchema.parse(validData);
    assert.equal(parsed.overallScore, 6.5);
    assert.equal(parsed.maxMarks, 10);
  });
});
