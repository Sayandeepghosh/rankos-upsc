import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getActiveUserId } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const activeUserId = await getActiveUserId();
    const body = await req.json();

    const userId = body.userId || activeUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized / No active session" }, { status: 401 });
    }

    const {
      targetYear = 2027,
      attemptNumber = 1,
      optionalSubject = "PSIR",
      dailyStudyHours = 6.0,
      wakeTime = "06:00",
      currentPhase = "Foundation",
      strongSubjects = "Polity,Ethics",
      weakSubjects = "Environment,Economy",
    } = body;

    const parsedYear = Number(targetYear);
    const prelimsDate = new Date(`${parsedYear}-05-23T09:30:00Z`);
    const mainsDate = new Date(`${parsedYear}-09-17T09:00:00Z`);
    const prelimsDaysLeft = Math.max(1, Math.ceil((prelimsDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    const mainsDaysLeft = Math.max(1, Math.ceil((mainsDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

    // 1. Update or create user profile with completed onboarding
    const profile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        targetYear: parsedYear,
        attemptNumber: Number(attemptNumber),
        optionalSubject,
        dailyStudyHours: Number(dailyStudyHours),
        wakeTime,
        currentPhase,
        strongSubjects: Array.isArray(strongSubjects) ? strongSubjects.join(",") : strongSubjects,
        weakSubjects: Array.isArray(weakSubjects) ? weakSubjects.join(",") : weakSubjects,
        onboardingCompleted: true,
      },
      create: {
        userId,
        targetYear: parsedYear,
        attemptNumber: Number(attemptNumber),
        optionalSubject,
        dailyStudyHours: Number(dailyStudyHours),
        wakeTime,
        currentPhase,
        strongSubjects: Array.isArray(strongSubjects) ? strongSubjects.join(",") : strongSubjects,
        weakSubjects: Array.isArray(weakSubjects) ? weakSubjects.join(",") : weakSubjects,
        onboardingCompleted: true,
      },
    });

    // 2. Re-create or update exam targets for this year
    await prisma.examTarget.deleteMany({ where: { userId } });
    await prisma.examTarget.createMany({
      data: [
        {
          userId,
          examName: `UPSC CSE ${parsedYear} Prelims`,
          examStage: "Prelims",
          targetDate: prelimsDate,
          daysLeft: prelimsDaysLeft,
          isPrimary: true,
        },
        {
          userId,
          examName: `UPSC CSE ${parsedYear} Mains`,
          examStage: "Mains",
          targetDate: mainsDate,
          daysLeft: mainsDaysLeft,
          isPrimary: false,
        },
      ],
    });

    // 3. Ensure starter tasks exist for this user if they don't have tasks
    const existingTasksCount = await prisma.studyTask.count({ where: { userId } });
    if (existingTasksCount === 0) {
      await prisma.studyTask.createMany({
        data: [
          {
            userId,
            title: `Core Study: ${optionalSubject} Optional Foundation`,
            subject: optionalSubject,
            topic: `${optionalSubject} Foundations & Key Scholars`,
            taskType: "Learning",
            estimatedMinutes: 90,
            actualMinutes: 0,
            priority: "High",
            priorityScore: 90,
            status: "PENDING",
            reason: "Core optional subject mastery needed early for high score",
            scheduledDate: new Date(),
          },
          {
            userId,
            title: "Core Study: GS-2 Indian Constitution & Preamble",
            subject: "Polity",
            topic: "Preamble & Basic Structure",
            taskType: "Learning",
            estimatedMinutes: 60,
            actualMinutes: 0,
            priority: "High",
            priorityScore: 85,
            status: "PENDING",
            reason: `Foundational GS-2 topic for UPSC CSE ${parsedYear}`,
            scheduledDate: new Date(),
          },
          {
            userId,
            title: "Spaced Active Recall: Fundamental Rights (Articles 14-32)",
            subject: "Polity",
            topic: "Fundamental Rights",
            taskType: "Revision",
            estimatedMinutes: 25,
            actualMinutes: 0,
            priority: "Urgent",
            priorityScore: 95,
            status: "PENDING",
            reason: "Spaced repetition drill to lock memory before decay",
            scheduledDate: new Date(),
          },
          {
            userId,
            title: "Prelims Drill: 10 MCQs on Constitutional Framework",
            subject: "Polity",
            topic: "Historical Underpinnings",
            taskType: "MCQ Practice",
            estimatedMinutes: 20,
            actualMinutes: 0,
            priority: "Medium",
            priorityScore: 70,
            status: "PENDING",
            reason: "Test elimination technique and identify traps",
            scheduledDate: new Date(),
          },
        ],
      });
    }

    const response = NextResponse.json({
      success: true,
      message: `Onboarding completed for UPSC CSE ${parsedYear}!`,
      profile,
    });

    response.cookies.set({
      name: "rankos_user_id",
      value: userId,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
