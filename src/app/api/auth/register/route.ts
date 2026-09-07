import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      targetYear = 2027,
      optionalSubject = "PSIR",
      dailyStudyHours = 6.0,
      currentPhase = "Foundation",
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    // Check if email exists locally
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A local profile with this email already exists. You can sign in directly." },
        { status: 409 }
      );
    }

    // Generate avatar initials URL or placeholder
    const initials = name
      .split(" ")
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        profile: {
          create: {
            targetYear: Number(targetYear),
            attemptNumber: 1,
            currentPhase,
            optionalSubject,
            dailyStudyHours: Number(dailyStudyHours),
            wakeTime: "06:00",
            strongSubjects: "Polity,Ethics",
            weakSubjects: "Environment,Economy",
            aiProvider: "heuristic",
            aiModel: "UPSC Expert Heuristics v2.4",
          },
        },
        examTargets: {
          create: [
            {
              examName: `UPSC CSE ${targetYear} Prelims`,
              examStage: "Prelims",
              targetDate: new Date(`${targetYear}-05-23T09:30:00Z`),
              daysLeft: Math.max(
                1,
                Math.ceil((new Date(`${targetYear}-05-23`).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              ),
              isPrimary: true,
            },
            {
              examName: `UPSC CSE ${targetYear} Mains`,
              examStage: "Mains",
              targetDate: new Date(`${targetYear}-09-17T09:00:00Z`),
              daysLeft: Math.max(
                1,
                Math.ceil((new Date(`${targetYear}-09-17`).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              ),
              isPrimary: false,
            },
          ],
        },
        // Seed starter tasks for this new aspirant
        tasks: {
          create: [
            {
              title: "Core Study: Preamble & Constitutional Philosophy",
              subject: "Polity",
              topic: "Preamble & Basic Structure",
              taskType: "Learning",
              estimatedMinutes: 60,
              actualMinutes: 0,
              priority: "High",
              priorityScore: 85,
              status: "PENDING",
              reason: "High-yield foundational topic for Prelims & GS-2",
              scheduledDate: new Date(),
            },
            {
              title: "Active Recall: Fundamental Rights (Articles 14-32)",
              subject: "Polity",
              topic: "Fundamental Rights",
              taskType: "Revision",
              estimatedMinutes: 30,
              actualMinutes: 0,
              priority: "Urgent",
              priorityScore: 92,
              status: "PENDING",
              reason: "Spaced revision to lock memory before decay",
              scheduledDate: new Date(),
            },
            {
              title: "Prelims Practice: 10 MCQs on Constitutional Framework",
              subject: "Polity",
              topic: "Historical Underpinnings",
              taskType: "Practice",
              estimatedMinutes: 20,
              actualMinutes: 0,
              priority: "Medium",
              priorityScore: 70,
              status: "PENDING",
              reason: "Test elimination technique and identify traps",
              scheduledDate: new Date(),
            },
          ],
        },
      },
      include: {
        profile: true,
        examTargets: true,
        tasks: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      user,
      message: `Created and signed in to local account for ${user.name}!`,
    });

    // Set cookie for 365 days
    response.cookies.set({
      name: "rankos_user_id",
      value: user.id,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
