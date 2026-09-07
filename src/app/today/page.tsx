import React from "react";
import { prisma } from "@/lib/db/prisma";
import { TodayMissionView } from "@/features/today/TodayMissionView";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const user = await prisma.user.findFirst();
  const tasks = await prisma.studyTask.findMany({
    orderBy: [{ priorityScore: "desc" }, { scheduledDate: "asc" }],
  });
  const sessions = await prisma.studySession.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return <TodayMissionView initialTasks={tasks} recentSessions={sessions} user={user} />;
}
