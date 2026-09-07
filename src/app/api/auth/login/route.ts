import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";

export async function POST(req: Request) {
  try {
    const { username, password, userId } = await req.json();

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });
    } else if (username) {
      const cleanUsername = username.trim().toLowerCase();
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: cleanUsername },
            { email: cleanUsername },
            { email: `${cleanUsername}@local.rankos` },
          ],
        },
        include: { profile: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Local account not found" }, { status: 404 });
    }

    // If password was provided and account has a passwordHash, verify it
    if (user.passwordHash) {
      if (!password) {
        return NextResponse.json({ error: "Password is required" }, { status: 400 });
      }
      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
    }

    const onboardingCompleted = user.profile?.onboardingCompleted ?? true;

    const response = NextResponse.json({
      success: true,
      user,
      onboardingCompleted,
      message: `Signed in as ${user.name}`,
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
