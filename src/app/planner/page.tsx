import React from "react";
import { prisma } from "@/lib/db/prisma";
import { SmartPlannerView } from "@/features/planner/SmartPlannerView";

export const dynamic = "force-dynamic";

export default async function PlannerPage() {
  const user = await prisma.user.findFirst({
    include: { profile: true },
  });

  const tasks = await prisma.studyTask.findMany({
    orderBy: { scheduledDate: "asc" },
  });

  const plans = await prisma.studyPlan.findMany({
    orderBy: { date: "desc" },
    take: 7,
  });

  return <SmartPlannerView user={user} tasks={tasks} plans={plans} />;
}
