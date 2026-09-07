import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getActiveUser } from "@/lib/auth/session";
import { CommandCenterDashboard } from "@/features/command-center/CommandCenterDashboard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getActiveUser({
    include: {
      profile: true,
      examTargets: true,
      tasks: {
        orderBy: [{ priorityScore: "desc" }, { scheduledDate: "asc" }],
      },
      revisions: {
        include: { node: true },
        orderBy: { scheduledDate: "asc" },
      },
      mistakes: {
        where: { status: "OPEN" },
      },
      analytics: {
        orderBy: { date: "asc" },
        take: 7,
      },
    },
  });

  // If no user or onboarding not finished, present fullscreen onboarding & prerequisites
  if (!user || !user.profile?.onboardingCompleted) {
    redirect("/onboarding");
  }

  const readiness = await prisma.readinessMetric.findMany();
  const mockTest = await prisma.test.findFirst({
    include: { attempts: true },
  });

  return (
    <CommandCenterDashboard
      user={user}
      readiness={readiness}
      mockTest={mockTest}
    />
  );
}
