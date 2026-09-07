import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });
    } else if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "Local account not found" }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      user,
      message: `Signed in locally as ${user.name}`,
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
