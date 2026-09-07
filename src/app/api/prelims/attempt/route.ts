import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { evaluateMCQAttempt } from "@/lib/prelims/marking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionId, selectedOptionId, eliminationMethod = "Knew directly", timeSpentSec = 45 } = body;

    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true, node: true },
    });

    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

    const selectedOption = question.options.find((o) => o.id === selectedOptionId);
    const correctOption = question.options.find((o) => o.isCorrect);

    const isCorrect = selectedOption?.isCorrect ?? false;
    const scoring = evaluateMCQAttempt({
      isCorrect,
      paper: (question.paper as "GS-1" | "CSAT") || "GS-1",
      eliminationMethod,
      timeTakenSec: timeSpentSec,
    });

    // Record attempt
    const attempt = await prisma.questionAttempt.create({
      data: {
        questionId,
        userId: user.id,
        selectedOptionId,
        isCorrect,
        marksObtained: scoring.marksObtained,
        timeSpentSec,
        eliminationMethod,
      },
    });

    // If incorrect, automatically store in Mistake Vault!
    if (!isCorrect && selectedOption) {
      await prisma.mistake.create({
        data: {
          userId: user.id,
          nodeId: question.nodeId,
          source: "Prelims MCQ Drill",
          questionText: question.questionText,
          userResponse: `${selectedOption.optionLabel}: ${selectedOption.optionText}`,
          correctResponse: `${correctOption?.optionLabel || ""}: ${correctOption?.optionText || ""}`,
          reasonForError:
            eliminationMethod === "Blind guess"
              ? "Blind guess under mock pressure"
              : eliminationMethod === "Eliminated two"
              ? "Poor elimination between final two choices"
              : "Conceptual gap or memory lapse",
          mistakeType:
            eliminationMethod === "Eliminated two"
              ? "Poor elimination"
              : eliminationMethod === "Blind guess"
              ? "Guessing"
              : "Knowledge gap",
          topic: question.topic,
          subject: question.subject,
          repetitionCount: 1,
          correctiveAction: question.eliminationTip || "Review syllabus notes and re-attempt similar questions.",
          nextReviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          status: "OPEN",
        },
      });
    }

    // Update topic progress accuracy & counts
    if (question.nodeId) {
      const prog = await prisma.topicProgress.findUnique({
        where: { nodeId_userId: { nodeId: question.nodeId, userId: user.id } },
      });

      if (prog) {
        const newCount = prog.questionsAnswered + 1;
        const newCorrect = isCorrect ? Math.round((prog.accuracy / 100) * prog.questionsAnswered) + 1 : Math.round((prog.accuracy / 100) * prog.questionsAnswered);
        const newAccuracy = Number(((newCorrect / newCount) * 100).toFixed(1));

        await prisma.topicProgress.update({
          where: { id: prog.id },
          data: {
            questionsAnswered: newCount,
            accuracy: newAccuracy,
            testScore: newAccuracy,
            lastStudiedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      attempt,
      isCorrect,
      marksObtained: scoring.marksObtained,
      correctOptionId: correctOption?.id,
      explanation: question.explanation,
      eliminationTip: question.eliminationTip,
    });
  } catch (error) {
    console.error("POST /api/prelims/attempt error:", error);
    return NextResponse.json({ error: "Failed to record attempt" }, { status: 500 });
  }
}
