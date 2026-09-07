import React from "react";
import { prisma } from "@/lib/db/prisma";
import { MistakeVaultView } from "@/features/mistakes/MistakeVaultView";

export const dynamic = "force-dynamic";

export default async function MistakesPage() {
  const mistakes = await prisma.mistake.findMany({
    include: { node: true },
    orderBy: [{ repetitionCount: "desc" }, { createdAt: "desc" }],
  });

  return <MistakeVaultView mistakes={mistakes} />;
}
