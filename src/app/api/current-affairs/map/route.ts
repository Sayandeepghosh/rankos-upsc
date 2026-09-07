import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { caId, nodeId, approvedBy = "User" } = body;

    const link = await prisma.currentAffairTopicLink.create({
      data: {
        caId,
        nodeId,
        approvedBy,
        relevance: "High",
      },
    });

    return NextResponse.json({ link });
  } catch (error) {
    console.error("POST /api/current-affairs/map error:", error);
    return NextResponse.json({ error: "Failed to map current affairs" }, { status: 500 });
  }
}
