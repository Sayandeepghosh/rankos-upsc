import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { evaluateMainsAnswer } from "@/lib/ai/provider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { questionId, answerText, timeTakenSec = 420, version = 1 } = body;

    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const question = await prisma.mainsQuestion.findUnique({
      where: { id: questionId },
      include: { node: true },
    });

    if (!question) return NextResponse.json({ error: "Question not found" }, { status: 404 });

    const words = answerText.trim().split(/\s+/).filter(Boolean).length;

    // Run strict AI evaluation
    const evaluationResult = await evaluateMainsAnswer({
      questionText: question.questionText,
      directive: question.directive,
      marks: question.marks,
      wordLimit: question.wordLimit,
      answerText,
      version,
    });

    // Record MainsAnswer
    const mainsAnswer = await prisma.mainsAnswer.create({
      data: {
        questionId,
        userId: user.id,
        version,
        answerText,
        wordCount: words,
        timeTakenSec,
        status: "EVALUATED",
        overallScore: evaluationResult.overallScore,
      },
    });

    // Record AnswerEvaluation
    const evaluation = await prisma.answerEvaluation.create({
      data: {
        answerId: mainsAnswer.id,
        evaluatorModel: "RankOS UPSC Strict Evaluator v2.4",
        overallScore: evaluationResult.overallScore,
        maxMarks: question.marks,
        understandingScore: evaluationResult.understandingScore,
        structureScore: evaluationResult.structureScore,
        dimensionsScore: evaluationResult.dimensionsScore,
        constitutionScore: evaluationResult.constitutionScore,
        examplesDataScore: evaluationResult.examplesDataScore,
        conclusionScore: evaluationResult.conclusionScore,
        strengths: JSON.stringify(evaluationResult.strengths),
        majorWeaknesses: JSON.stringify(evaluationResult.majorWeaknesses),
        missingDimensions: JSON.stringify(evaluationResult.missingDimensions),
        betterStructure: evaluationResult.betterStructure,
        enrichmentPoints: JSON.stringify(evaluationResult.enrichmentPoints),
        modelAnswer: evaluationResult.modelAnswer,
        improvementSummary: evaluationResult.improvementSummary,
      },
    });

    // Update topic progress answerScore
    if (question.nodeId) {
      const prog = await prisma.topicProgress.findUnique({
        where: { nodeId_userId: { nodeId: question.nodeId, userId: user.id } },
      });
      if (prog) {
        const normalizedScore = Number(((evaluationResult.overallScore / question.marks) * 100).toFixed(1));
        await prisma.topicProgress.update({
          where: { id: prog.id },
          data: {
            answerScore: normalizedScore,
            lastStudiedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      answerId: mainsAnswer.id,
      overallScore: evaluationResult.overallScore,
      maxMarks: question.marks,
      evaluation: evaluationResult,
    });
  } catch (error) {
    console.error("POST /api/mains/submit error:", error);
    return NextResponse.json({ error: "Failed to evaluate answer" }, { status: 500 });
  }
}
