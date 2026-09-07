import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const tasks = await prisma.studyTask.findMany({
      orderBy: [{ priorityScore: "desc" }, { scheduledDate: "asc" }],
    });
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("GET /api/study/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newTask = await prisma.studyTask.create({
      data: {
        userId: user.id,
        title: body.title,
        subject: body.subject,
        topic: body.topic,
        reason: body.reason || "Scheduled manually by aspirant.",
        taskType: body.taskType || "Learning",
        priority: body.priority || "High",
        priorityScore: body.priorityScore || 80.0,
        estimatedMinutes: Number(body.estimatedMinutes) || 60,
        timeSlot: body.timeSlot || "Flexible",
        status: "PENDING",
        expectedOutput: body.expectedOutput,
      },
    });

    return NextResponse.json({ task: newTask });
  } catch (error) {
    console.error("POST /api/study/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { taskId, status, actualMinutes, completionNotes } = body;

    const updated = await prisma.studyTask.update({
      where: { id: taskId },
      data: {
        status,
        actualMinutes: actualMinutes !== undefined ? Number(actualMinutes) : undefined,
        completionNotes: completionNotes || undefined,
      },
    });

    if (status === "COMPLETED") {
      const user = await prisma.user.findFirst();
      if (user) {
        await prisma.studySession.create({
          data: {
            userId: user.id,
            taskId: updated.id,
            subject: updated.subject,
            topic: updated.topic,
            sessionType: "Standard",
            plannedMinutes: updated.estimatedMinutes,
            actualMinutes: updated.actualMinutes || updated.estimatedMinutes,
            distractions: 0,
            rating: 4,
            notes: completionNotes || "Task marked complete via Today Mission.",
          },
        });
      }
    }

    return NextResponse.json({ task: updated });
  } catch (error) {
    console.error("PATCH /api/study/tasks error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
