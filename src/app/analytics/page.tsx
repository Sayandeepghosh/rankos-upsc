import React from "react";
import { prisma } from "@/lib/db/prisma";
import { AnalyticsEngineView } from "@/features/analytics/AnalyticsEngineView";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const readiness = await prisma.readinessMetric.findMany();
  const snapshots = await prisma.analyticsSnapshot.findMany({
    orderBy: { date: "asc" },
  });
  const mistakes = await prisma.mistake.findMany({
    where: { status: "OPEN" },
  });
  const user = await prisma.user.findFirst({
    include: { profile: true },
  });

  return (
    <AnalyticsEngineView
      readiness={readiness}
      snapshots={snapshots}
      mistakes={mistakes}
      user={user}
    />
  );
}
