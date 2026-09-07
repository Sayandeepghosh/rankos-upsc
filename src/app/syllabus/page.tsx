import React from "react";
import { prisma } from "@/lib/db/prisma";
import { SyllabusTreeView } from "@/features/syllabus/SyllabusTreeView";

export const dynamic = "force-dynamic";

export default async function SyllabusPage() {
  const papers = await prisma.paper.findMany({
    include: {
      subjects: true,
      syllabusNodes: {
        include: {
          progress: true,
          pyqs: true,
          questions: true,
          mainsQuestions: true,
          children: {
            include: {
              progress: true,
              children: {
                include: { progress: true },
              },
            },
          },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  return <SyllabusTreeView papers={papers} />;
}
