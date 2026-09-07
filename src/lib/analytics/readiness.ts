/**
 * Transparent Readiness Engine
 * Produces 0-100 scores with itemized drivers and drag factors
 */

export interface ReadinessBreakdown {
  score: number;
  band: "At Risk" | "Consolidation" | "Competitive" | "Top Ranker";
  trajectory: "Improving" | "Stable" | "Declining";
  positiveFactors: string[];
  negativeFactors: string[];
  targetBandRecommendation: string;
}

export function calculatePrelimsReadiness(stats: {
  syllabusCoveragePct: number;
  mcqAccuracy: number;
  mockAverageScore: number;
  revisionHealth: number;
  pyqsAttemptedPct: number;
}): ReadinessBreakdown {
  // In UPSC GS-1, 120 marks is the 99th percentile cutoff benchmark
  const mockNormalized = Math.min(100, (stats.mockAverageScore / 130) * 100);

  // Weights: Accuracy 30%, Mock Score 25%, Syllabus 20%, Revision 15%, PYQs 10%
  const score = Math.round(
    stats.mcqAccuracy * 0.30 +
    mockNormalized * 0.25 +
    stats.syllabusCoveragePct * 0.20 +
    stats.revisionHealth * 0.15 +
    stats.pyqsAttemptedPct * 0.10
  );

  const bounded = Math.max(0, Math.min(100, score));

  const positive: string[] = [];
  const negative: string[] = [];

  if (stats.mcqAccuracy >= 70) positive.push(`High MCQ Accuracy (${stats.mcqAccuracy.toFixed(1)}%) in GS-1`);
  else negative.push(`Sub-optimal MCQ Accuracy (${stats.mcqAccuracy.toFixed(1)}%), negative marking pulling score down`);

  if (stats.mockAverageScore >= 105) positive.push(`Comfortably crossing cutoff threshold with mock avg ${stats.mockAverageScore}`);
  else negative.push(`Mock average (${stats.mockAverageScore}) is below target safe score of 105+`);

  if (stats.revisionHealth >= 75) positive.push(`Strong spaced repetition consistency (${stats.revisionHealth}%)`);
  else negative.push(`Spaced repetition backlog dragging retention down`);

  if (stats.pyqsAttemptedPct >= 60) positive.push(`Solid PYQ coverage across core GS-1 papers (${stats.pyqsAttemptedPct}%)`);
  else negative.push(`Pending PYQ backlog in modern history & environment`);

  let band: "At Risk" | "Consolidation" | "Competitive" | "Top Ranker" = "Consolidation";
  if (bounded >= 85) band = "Top Ranker";
  else if (bounded >= 70) band = "Competitive";
  else if (bounded >= 50) band = "Consolidation";
  else band = "At Risk";

  return {
    score: bounded,
    band,
    trajectory: bounded >= 65 ? "Improving" : "Stable",
    positiveFactors: positive,
    negativeFactors: negative,
    targetBandRecommendation:
      band === "Top Ranker"
        ? "Maintain test discipline and focus on error elimination in tricky environment/art-culture questions."
        : "Prioritize elimination accuracy in 50:50 questions and clear overdue revision decks.",
  };
}
