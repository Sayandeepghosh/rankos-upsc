/**
 * Spaced Repetition Engine for UPSC Revision
 * Adaptive interval calculation based on recall feedback (Forgot, Hard, Good, Easy)
 */

export type RecallRating = "Forgot" | "Hard" | "Good" | "Easy";

export interface IntervalResult {
  newIntervalDays: number;
  newScheduledDate: Date;
  status: "DUE" | "OVERDUE" | "COMPLETED";
  recallHealth: number; // 0-100
}

export function calculateNextRevision(
  currentIntervalDays: number,
  rating: RecallRating,
  baseDate: Date = new Date()
): IntervalResult {
  let newIntervalDays: number;

  switch (rating) {
    case "Forgot":
      // Reset to 1 day for immediate re-learning
      newIntervalDays = 1;
      break;
    case "Hard":
      // Modest increase or minimum 2 days
      newIntervalDays = Math.max(2, Math.round(currentIntervalDays * 1.2));
      break;
    case "Good":
      // Standard progression (e.g. 1 -> 3 -> 7 -> 16 -> 35 days)
      if (currentIntervalDays <= 1) newIntervalDays = 3;
      else if (currentIntervalDays <= 3) newIntervalDays = 7;
      else if (currentIntervalDays <= 7) newIntervalDays = 16;
      else if (currentIntervalDays <= 16) newIntervalDays = 35;
      else newIntervalDays = Math.round(currentIntervalDays * 2.2);
      break;
    case "Easy":
      // Aggressive interval extension for well-consolidated topics
      if (currentIntervalDays <= 1) newIntervalDays = 5;
      else if (currentIntervalDays <= 3) newIntervalDays = 12;
      else if (currentIntervalDays <= 7) newIntervalDays = 25;
      else newIntervalDays = Math.round(currentIntervalDays * 3.2);
      break;
  }

  const newScheduledDate = new Date(baseDate);
  newScheduledDate.setDate(newScheduledDate.getDate() + newIntervalDays);

  const healthMap: Record<RecallRating, number> = {
    Forgot: 25,
    Hard: 60,
    Good: 90,
    Easy: 100,
  };

  return {
    newIntervalDays,
    newScheduledDate,
    status: "COMPLETED",
    recallHealth: healthMap[rating],
  };
}

export function calculateRevisionHealth(scheduledDate: Date | string): number {
  const sched = new Date(scheduledDate);
  const now = new Date();
  const diffDays = (now.getTime() - sched.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays <= 0) {
    // Scheduled in future: 100% health
    return 100;
  }
  // Overdue: health drops by 10% per overdue day, min 10%
  const decay = Math.min(90, Math.floor(diffDays * 12));
  return Math.max(10, 100 - decay);
}
