import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getActiveUserId } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
        examTargets: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const activeUserId = await getActiveUserId();

    return NextResponse.json({
      users,
      activeUserId: activeUserId || users[0]?.id || null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
