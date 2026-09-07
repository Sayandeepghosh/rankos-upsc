import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { calculateNextRevision, RecallRating } from "@/lib/scheduling/spaced-repetition";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scheduleId, rating, timeSpentSec = 300, notesReviewed } = body;

    const schedule = await prisma.revisionSchedule.findUnique({
      where: { id: scheduleId },
      include: { node: true },
    });

    if (!schedule) return NextResponse.json({ error: "Schedule not found" }, { status: 404 });

    const intervalResult = calculateNextRevision(schedule.intervalDays, rating as RecallRating);

    // Record revision attempt
    await prisma.revisionAttempt.create({
      data: {
        scheduleId: schedule.id,
        rating,
        oldInterval: schedule.intervalDays,
        newInterval: intervalResult.newIntervalDays,
        recalledCorrect: rating !== "Forgot",
        notesReviewed: notesReviewed || undefined,
        timeSpentSec: Number(timeSpentSec) || 300,
      },
    });

    // Update schedule
    const updatedSchedule = await prisma.revisionSchedule.update({
      where: { id: schedule.id },
      data: {
        revisionNumber: schedule.revisionNumber + 1,
        intervalDays: intervalResult.newIntervalDays,
        scheduledDate: intervalResult.newScheduledDate,
        lastRevisionDate: new Date(),
        status: rating === "Forgot" ? "DUE" : "COMPLETED",
        recallHealth: intervalResult.recallHealth,
      },
    });

    // Update topic progress revision health
    if (schedule.nodeId) {
      await prisma.topicProgress.updateMany({
        where: { nodeId: schedule.nodeId, userId: schedule.userId },
        data: {
          revisionHealth: intervalResult.recallHealth,
          lastStudiedAt: new Date(),
          nextRevisionAt: intervalResult.newScheduledDate,
        },
      });
    }

    return NextResponse.json({
      schedule: updatedSchedule,
      nextRevisionDate: intervalResult.newScheduledDate,
      recallHealth: intervalResult.recallHealth,
    });
  } catch (error) {
    console.error("POST /api/revision/attempt error:", error);
    return NextResponse.json({ error: "Failed to record revision" }, { status: 500 });
  }
}
