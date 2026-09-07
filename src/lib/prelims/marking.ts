/**
 * Prelims Scoring and Elimination Analytics Engine
 */

export interface MCQAttemptInput {
  isCorrect: boolean;
  paper: "GS-1" | "CSAT";
  eliminationMethod: "Knew directly" | "Eliminated two" | "Educated guess" | "Blind guess";
  timeTakenSec: number;
}

export interface MCQScoringResult {
  marksObtained: number;
  isNegative: boolean;
  statusLabel: "Correct" | "Incorrect";
}

export function evaluateMCQAttempt(input: MCQAttemptInput): MCQScoringResult {
  if (input.paper === "GS-1") {
    if (input.isCorrect) {
      return { marksObtained: 2.0, isNegative: false, statusLabel: "Correct" };
    } else {
      return { marksObtained: -0.66, isNegative: true, statusLabel: "Incorrect" };
    }
  } else {
    if (input.isCorrect) {
      return { marksObtained: 2.5, isNegative: false, statusLabel: "Correct" };
    } else {
      return { marksObtained: -0.83, isNegative: true, statusLabel: "Incorrect" };
    }
  }
}
