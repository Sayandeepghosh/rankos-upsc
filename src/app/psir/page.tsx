import React from "react";
import { prisma } from "@/lib/db/prisma";
import { PSIROptionalView } from "@/features/psir/PSIROptionalView";

export const dynamic = "force-dynamic";

export default async function PSIRPage() {
  const thinkers = await prisma.thinker.findMany({
    include: { keyQuotes: true },
    orderBy: { name: "asc" },
  });

  const quotes = await prisma.quote.findMany({
    where: { subject: "PSIR" },
    include: { thinker: true },
  });

  return <PSIROptionalView thinkers={thinkers} quotes={quotes} />;
}
