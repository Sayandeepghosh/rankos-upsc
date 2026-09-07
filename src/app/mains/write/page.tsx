import React from "react";
import { prisma } from "@/lib/db/prisma";
import { MainsWorkspaceView } from "@/features/mains/MainsWorkspaceView";

export const dynamic = "force-dynamic";

export default async function MainsWritePage() {
  const questions = await prisma.mainsQuestion.findMany({
    include: {
      node: true,
      answers: {
        include: { evaluations: true },
        orderBy: { version: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <MainsWorkspaceView questions={questions} />;
}
