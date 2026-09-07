import React from "react";
import { prisma } from "@/lib/db/prisma";
import { EssayLabView } from "@/features/essay/EssayLabView";

export const dynamic = "force-dynamic";

export default async function EssayPage() {
  const essays = await prisma.essay.findMany({
    include: { attempts: true },
    orderBy: { createdAt: "desc" },
  });

  return <EssayLabView essays={essays} />;
}
