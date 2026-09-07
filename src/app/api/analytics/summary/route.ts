import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      include: { profile: true, examTargets: true },
    });

    const tasks = await prisma.studyTask.findMany({
      orderBy: { scheduledDate: "desc" },
      take: 20,
    });

    const revisions = await prisma.revisionSchedule.findMany({
      orderBy: { scheduledDate: "asc" },
    });

    const readiness = await prisma.readinessMetric.findMany();
    const mistakes = await prisma.mistake.findMany({
      where: { status: "OPEN" },
      take: 5,
    });

    const analytics = await prisma.analyticsSnapshot.findMany({
      orderBy: { date: "asc" },
      take: 7,
    });

    const completedTasks = tasks.filter((t) => t.status === "COMPLETED").length;
    const totalMinutesStudied = tasks
      .filter((t) => t.status === "COMPLETED")
      .reduce((acc, t) => acc + (t.actualMinutes || t.estimatedMinutes), 0);

    return NextResponse.json({
      user,
      stats: {
        completedTasks,
        totalTasks: tasks.length,
        totalMinutesStudied,
        studyStreakDays: 14,
        revisionsDueCount: revisions.filter((r) => r.status === "DUE" || r.status === "OVERDUE").length,
        openMistakesCount: mistakes.length,
        prelimsDaysLeft: user?.examTargets[0]?.daysLeft || 623,
      },
      readiness,
      mistakes,
      revisions: revisions.slice(0, 5),
      tasks: tasks.slice(0, 6),
      analytics,
    });
  } catch (error) {
    console.error("GET /api/analytics/summary error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics summary" }, { status: 500 });
  }
}
