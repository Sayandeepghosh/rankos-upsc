import React from "react";
import { prisma } from "@/lib/db/prisma";
import { ResourceLibraryView } from "@/features/resources/ResourceLibraryView";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });

  return <ResourceLibraryView resources={resources} />;
}
