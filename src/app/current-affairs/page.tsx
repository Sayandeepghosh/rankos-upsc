import React from "react";
import { prisma } from "@/lib/db/prisma";
import { CurrentAffairsView } from "@/features/current-affairs/CurrentAffairsView";

export const dynamic = "force-dynamic";

export default async function CurrentAffairsPage() {
  const currentAffairs = await prisma.currentAffair.findMany({
    include: {
      topicLinks: {
        include: { node: true },
      },
    },
    orderBy: { publishDate: "desc" },
  });

  const syllabusNodes = await prisma.syllabusNode.findMany({
    take: 20,
  });

  return <CurrentAffairsView currentAffairs={currentAffairs} syllabusNodes={syllabusNodes} />;
}
