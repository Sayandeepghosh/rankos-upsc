import React from "react";
import { prisma } from "@/lib/db/prisma";
import { EthicsLabView } from "@/features/ethics/EthicsLabView";

export const dynamic = "force-dynamic";

export default async function EthicsPage() {
  const cases = await prisma.ethicsCase.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <EthicsLabView cases={cases} />;
}
