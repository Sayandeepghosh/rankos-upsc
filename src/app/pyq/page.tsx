import React from "react";
import { prisma } from "@/lib/db/prisma";
import { PYQLabView } from "@/features/pyq/PYQLabView";

export const dynamic = "force-dynamic";

export default async function PYQPage() {
  const pyqs = await prisma.pYQ.findMany({
    include: { node: true },
    orderBy: [{ year: "desc" }, { paper: "asc" }],
  });

  return <PYQLabView pyqs={pyqs} />;
}
