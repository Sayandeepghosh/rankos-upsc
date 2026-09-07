import React from "react";
import { prisma } from "@/lib/db/prisma";
import { PrelimsEngineView } from "@/features/prelims/PrelimsEngineView";

export const dynamic = "force-dynamic";

export default async function PrelimsPage() {
  const questions = await prisma.question.findMany({
    include: {
      options: true,
      node: true,
      attempts: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const attempts = await prisma.questionAttempt.findMany({
    include: { question: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return <PrelimsEngineView questions={questions} pastAttempts={attempts} />;
}
