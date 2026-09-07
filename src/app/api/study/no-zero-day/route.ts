import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Mark existing pending tasks as rescheduled
    await prisma.studyTask.updateMany({
      where: { userId: user.id, status: "PENDING" },
      data: { status: "RESCHEDULED", isBacklog: true, backlogAction: "Reschedule" },
    });

    // Generate minimum 4 survival tasks for continuity
    const survivalTasks = await prisma.studyTask.createMany({
      data: [
        {
          userId: user.id,
          title: "Survival Mode: 20-min Spaced Recall",
          subject: "Polity",
          topic: "Governor's Discretionary Powers",
          reason: "No Zero Day Mode: Maintain neural retention loop.",
          taskType: "Recall",
          priority: "Urgent",
          priorityScore: 98.0,
          estimatedMinutes: 20,
          timeSlot: "Flexible",
          status: "PENDING",
          expectedOutput: "Recall Articles 163, 200, 356 and Shamsher Singh rule.",
        },
        {
          userId: user.id,
          title: "Survival Mode: 10 Rapid MCQs",
          subject: "Environment",
          topic: "Wildlife Protection Act Schedules",
          reason: "No Zero Day Mode: Stop accuracy decay in weak area.",
          taskType: "MCQ Practice",
          priority: "High",
          priorityScore: 90.0,
          estimatedMinutes: 15,
          timeSlot: "Flexible",
          status: "PENDING",
          expectedOutput: "Solve 10 questions with elimination tagging.",
        },
        {
          userId: user.id,
          title: "Survival Mode: 1 PSIR Core Concept Recall",
          subject: "PSIR",
          topic: "Rawls vs Nozick",
          reason: "No Zero Day Mode: Quick thinker contrast refresh.",
          taskType: "Recall",
          priority: "High",
          priorityScore: 85.0,
          estimatedMinutes: 15,
          timeSlot: "Flexible",
          status: "PENDING",
          expectedOutput: "Write 3 key differences: Difference Principle vs Entitlement Theory.",
        },
        {
          userId: user.id,
          title: "Survival Mode: 1 Mains Outline Brainstorm",
          subject: "Polity",
          topic: "Parliamentary Standing Committees",
          reason: "No Zero Day Mode: Keep answer structure muscle active.",
          taskType: "Answer Writing",
          priority: "Medium",
          priorityScore: 80.0,
          estimatedMinutes: 15,
          timeSlot: "Flexible",
          status: "PENDING",
          expectedOutput: "Draft Intro, 3 points of scrutiny, 2 reforms, and conclusion.",
        },
      ],
    });

    return NextResponse.json({ success: true, count: survivalTasks.count });
  } catch (error) {
    console.error("POST /api/study/no-zero-day error:", error);
    return NextResponse.json({ error: "Failed to activate No Zero Day" }, { status: 500 });
  }
}
