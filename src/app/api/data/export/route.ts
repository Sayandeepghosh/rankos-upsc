import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json";

    const user = await prisma.user.findFirst({
      include: {
        profile: true,
        tasks: true,
        sessions: true,
        mistakes: true,
        revisions: true,
        notes: true,
        mainsAnswers: { include: { evaluations: true } },
      },
    });

    if (format === "csv") {
      // Return simple CSV of completed tasks
      const header = "Title,Subject,Topic,TaskType,Status,ActualMinutes,Date\n";
      const rows = (user?.tasks || [])
        .map((t) => `"${t.title}","${t.subject}","${t.topic}","${t.taskType}","${t.status}",${t.actualMinutes},"${t.scheduledDate}"`)
        .join("\n");
      return new Response(header + rows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=rankos-export.csv",
        },
      });
    }

    return new Response(JSON.stringify(user, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=rankos-backup.json",
      },
    });
  } catch (error) {
    console.error("GET /api/data/export error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
