/**
 * Daily Commander & Task Priority Engine
 * Priority Formula:
 * Priority = (ExamImportance * 0.25) + (WeaknessFactor * 0.25) + (RevisionUrgency * 0.20) + (PYQFrequency * 0.15) + (BacklogFactor * 0.15)
 */

export interface PriorityFactors {
  examImportance: number; // 0-100
  isWeakTopic: boolean;
  revisionUrgent: boolean;
  pyqFrequency: number;   // 0-20+
  isBacklog: boolean;
}

export function computeTaskPriority(factors: PriorityFactors): {
  score: number;
  priorityLabel: "Urgent" | "High" | "Medium" | "Low";
  reason: string;
} {
  const examScore = factors.examImportance;
  const weakScore = factors.isWeakTopic ? 100 : 30;
  const revScore = factors.revisionUrgent ? 100 : 20;
  const pyqScore = Math.min(100, factors.pyqFrequency * 10);
  const backlogScore = factors.isBacklog ? 90 : 10;

  const total =
    examScore * 0.25 +
    weakScore * 0.25 +
    revScore * 0.20 +
    pyqScore * 0.15 +
    backlogScore * 0.15;

  const normalized = Math.min(100, Math.max(10, Math.round(total)));

  let priorityLabel: "Urgent" | "High" | "Medium" | "Low" = "Medium";
  if (normalized >= 80) priorityLabel = "Urgent";
  else if (normalized >= 65) priorityLabel = "High";
  else if (normalized >= 40) priorityLabel = "Medium";
  else priorityLabel = "Low";

  let reason = "Scheduled as part of balanced syllabus progression.";
  if (factors.revisionUrgent && factors.isWeakTopic) {
    reason = "Critical weakness + overdue revision in high-yield UPSC topic.";
  } else if (factors.revisionUrgent) {
    reason = "Memory retention decay alert: revision window is active today.";
  } else if (factors.isWeakTopic) {
    reason = "Identified weakness in recent tests; targeted reinforcement required.";
  } else if (factors.pyqFrequency >= 5) {
    reason = `High-yield theme tested ${factors.pyqFrequency} times in recent UPSC examinations.`;
  } else if (factors.isBacklog) {
    reason = "Re-prioritized from backlog to maintain syllabus completion momentum.";
  }

  return {
    score: normalized,
    priorityLabel,
    reason,
  };
}

export function resolveBacklogItem(item: {
  importance: "High" | "Medium" | "Low";
  daysOverdue: number;
  masteryScore: number;
}): {
  action: "Reschedule" | "Compress" | "Merge" | "Replace" | "Drop";
  reason: string;
} {
  if (item.importance === "High" && item.masteryScore < 50) {
    return {
      action: "Reschedule",
      reason: "High-yield topic with low mastery must not be dropped. Prioritized for immediate slot.",
    };
  }
  if (item.masteryScore >= 75) {
    return {
      action: "Drop",
      reason: "Topic already has strong baseline mastery (>75%). Full study session replaced with quick recall prompt.",
    };
  }
  if (item.daysOverdue > 14 && item.importance === "Low") {
    return {
      action: "Drop",
      reason: "Low yield item stale for over 2 weeks. Dropped to protect primary syllabus velocity.",
    };
  }
  if (item.daysOverdue > 5) {
    return {
      action: "Compress",
      reason: "Compressing into high-efficiency 30-minute revision sheet recall to avoid backlog pileup.",
    };
  }
  return {
    action: "Merge",
    reason: "Merged with upcoming related unit study block.",
  };
}
