import React from "react";
import { prisma } from "@/lib/db/prisma";
import { MockWarRoomView } from "@/features/tests/MockWarRoomView";

export const dynamic = "force-dynamic";

export default async function TestsPage() {
  const tests = await prisma.test.findMany({
    include: {
      attempts: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return <MockWarRoomView tests={tests} />;
}
