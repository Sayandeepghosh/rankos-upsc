import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const session = await prisma.studySession.create({
      data: {
        userId: user.id,
        taskId: body.taskId || undefined,
        subject: body.subject || "General",
        topic: body.topic || "Deep Work Focus",
        sessionType: body.sessionType || "DeepWork90",
        plannedMinutes: Number(body.plannedMinutes) || 60,
        actualMinutes: Number(body.actualMinutes) || 60,
        distractions: Number(body.distractions) || 0,
        rating: Number(body.rating) || 5,
        notes: body.notes || "Completed Deep Work focus session.",
      },
    });

    return NextResponse.json({ session });
  } catch (error) {
    console.error("POST /api/study/sessions error:", error);
    return NextResponse.json({ error: "Failed to log session" }, { status: 500 });
  }
}
