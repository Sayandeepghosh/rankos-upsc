import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, name } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required for local signup" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: "Password must be at least 4 characters" },
        { status: 400 }
      );
    }

    // Check if username already exists locally
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { username: cleanUsername },
          { email: cleanUsername }
        ]
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: "This username is already registered locally. Please sign in." },
        { status: 409 }
      );
    }

    const displayName = name?.trim() || cleanUsername;
    const passwordHash = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        name: displayName,
        email: `${cleanUsername}@local.rankos`,
        passwordHash,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
        profile: {
          create: {
            targetYear: 2027,
            attemptNumber: 1,
            currentPhase: "Foundation",
            optionalSubject: "PSIR",
            dailyStudyHours: 6.0,
            wakeTime: "06:00",
            strongSubjects: "Polity,Ethics",
            weakSubjects: "Environment,Economy",
            onboardingCompleted: false, // Must complete fullscreen prerequisites!
            aiProvider: "heuristic",
            aiModel: "UPSC Expert Heuristics v2.4",
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      user,
      onboardingCompleted: false,
      message: `Account created for ${cleanUsername}! Please complete prerequisite setup.`,
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
