import React from "react";
import { prisma } from "@/lib/db/prisma";
import { RevisionDeckView } from "@/features/revision/RevisionDeckView";

export const dynamic = "force-dynamic";

export default async function RevisionPage() {
  const user = await prisma.user.findFirst();
  const schedules = await prisma.revisionSchedule.findMany({
    include: {
      node: true,
      attempts: { orderBy: { createdAt: "desc" }, take: 5 },
    },
    orderBy: { scheduledDate: "asc" },
  });

  return <RevisionDeckView user={user} schedules={schedules} />;
}
