/**
 * Topic Mastery Calculation Engine
 * Formula:
 * Mastery = Recall(25%) + Testing(25%) + AnswerWriting(20%) + RevisionHealth(15%) + PYQ(15%) - Decay(DaysUnrevised)
 */

export interface MasteryInput {
  recallScore: number;       // 0-100
  testScore: number;         // 0-100 (MCQ accuracy)
  answerScore: number;       // 0-100 (Mains answer score normalized)
  revisionHealth: number;    // 0-100 (Spaced repetition health)
  pyqPerformance: number;    // 0-100
  lastStudiedAt: Date | null | string;
}

export interface MasteryOutput {
  masteryScore: number;      // 0-100
  confidence: "Low" | "Medium" | "High";
  decayApplied: number;
  lifecycleStage: number;    // 1 to 13
  stageName: string;
}

export const LIFECYCLE_STAGES = [
  { stage: 1, name: "Not Started", minMastery: 0 },
  { stage: 2, name: "First Learning", minMastery: 10 },
  { stage: 3, name: "Notes Prepared", minMastery: 20 },
  { stage: 4, name: "First Recall", minMastery: 30 },
  { stage: 5, name: "Revision 1", minMastery: 40 },
  { stage: 6, name: "Revision 2", minMastery: 50 },
  { stage: 7, name: "PYQ Practiced", minMastery: 60 },
  { stage: 8, name: "MCQ Tested", minMastery: 70 },
  { stage: 9, name: "Mains Answer Practiced", minMastery: 75 },
  { stage: 10, name: "Weakness Detected", minMastery: 55 },
  { stage: 11, name: "Corrective Revision", minMastery: 80 },
  { stage: 12, name: "Retested", minMastery: 88 },
  { stage: 13, name: "Exam Ready", minMastery: 92 },
] as const;

export function calculateMastery(input: MasteryInput): MasteryOutput {
  const recallWeight = 0.25;
  const testWeight = 0.25;
  const answerWeight = 0.20;
  const revisionWeight = 0.15;
  const pyqWeight = 0.15;

  const rawScore =
    input.recallScore * recallWeight +
    input.testScore * testWeight +
    input.answerScore * answerWeight +
    input.revisionHealth * revisionWeight +
    input.pyqPerformance * pyqWeight;

  // Calculate decay based on days since last studied
  let decayApplied = 0;
  if (input.lastStudiedAt) {
    const lastDate = new Date(input.lastStudiedAt);
    const now = new Date();
    const diffDays = Math.max(0, Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));
    if (diffDays > 7) {
      // 0.5% per day past 7 days, capped at 25% max decay
      decayApplied = Math.min(25, (diffDays - 7) * 0.5);
    }
  }

  const finalScore = Math.max(0, Math.min(100, Math.round(rawScore - decayApplied)));

  let confidence: "Low" | "Medium" | "High" = "Low";
  if (finalScore >= 75) confidence = "High";
  else if (finalScore >= 45) confidence = "Medium";

  // Map to lifecycle stage
  let stage = 1;
  let stageName = "Not Started";
  for (const s of LIFECYCLE_STAGES) {
    if (finalScore >= s.minMastery) {
      stage = s.stage;
      stageName = s.name;
    }
  }

  return {
    masteryScore: finalScore,
    confidence,
    decayApplied,
    lifecycleStage: stage,
    stageName,
  };
}
