import React from "react";
import { prisma } from "@/lib/db/prisma";
import { SettingsView } from "@/features/settings/SettingsView";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await prisma.user.findFirst({
    include: { profile: true, examTargets: true },
  });

  return <SettingsView user={user} />;
}
