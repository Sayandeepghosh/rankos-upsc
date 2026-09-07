import { PrismaClient } from "@prisma/client";

export async function seedQuestions(
  prisma: PrismaClient,
  userId: string,
  nodes: {
    nodeCommittees: any;
    nodeGovernor: any;
    nodeWPA: any;
  }
) {
  // 1. Prelims MCQ 1
  const q1 = await prisma.question.create({
    data: {
      nodeId: nodes.nodeCommittees.id,
      paper: "GS-1",
      subject: "Polity",
      topic: "Parliamentary Committees",
      difficulty: "Medium",
      isPYQ: true,
      pyqYear: 2021,
      questionText:
        "With reference to the Parliament of India, which of the following Parliamentary Committees scrutinizes and reports to the House whether the powers to make regulations, rules, sub-rules, by-laws, etc. conferred by the Constitution or delegated by Parliament are being properly exercised within the ambit of such delegation?",
      explanation:
        "The Committee on Subordinate Legislation examines and reports to each House whether the powers to make regulations, rules, sub-rules, by-laws etc. conferred by the Constitution or delegated by Parliament are being properly exercised within the limits of such delegation.",
      eliminationTip:
        "Keyword association: Delegated legislation is formally known as 'Subordinate Legislation'. Therefore, Committee on Subordinate Legislation is the direct match.",
    },
  });

  await prisma.questionOption.createMany({
    data: [
      {
        questionId: q1.id,
        optionLabel: "A",
        optionText: "Committee on Government Assurances",
        isCorrect: false,
        whyWrong: "Scrutinizes promises and assurances given by ministers on the floor of the House.",
      },
      {
        questionId: q1.id,
        optionLabel: "B",
        optionText: "Committee on Subordinate Legislation",
        isCorrect: true,
      },
      {
        questionId: q1.id,
        optionLabel: "C",
        optionText: "Committee on Rules",
        isCorrect: false,
        whyWrong: "Considers matters of procedure and conduct of business in the House.",
      },
      {
        questionId: q1.id,
        optionLabel: "D",
        optionText: "Business Advisory Committee",
        isCorrect: false,
        whyWrong: "Regulates the programme and time-table of the House.",
      },
    ],
  });

  // 2. Prelims MCQ 2
  const q2 = await prisma.question.create({
    data: {
      nodeId: nodes.nodeWPA.id,
      paper: "GS-1",
      subject: "Environment",
      topic: "Wildlife Protection Act",
      difficulty: "Hard",
      isPYQ: true,
      pyqYear: 2023,
      questionText:
        "Consider the following statements regarding the Wildlife (Protection) Amendment Act, 2022:\n1. It reduced the total number of Schedules from six to four.\n2. Schedule I provides the highest level of protection for animal species.\n3. The Act introduced a dedicated Schedule for specimens of flora and fauna listed under CITES Appendices.\n\nWhich of the statements given above are correct?",
      explanation:
        "The 2022 Amendment rationalized the Schedules from 6 to 4: Schedule I (specially protected animals), Schedule II (lesser protection), Schedule III (protected plants), and Schedule IV (specimens listed in CITES Appendices). Vermin schedule was completely removed.",
      eliminationTip:
        "Remember that the 2022 amendment chief international obligation was alignment with CITES convention, which necessitated dedicated Schedule IV.",
    },
  });

  await prisma.questionOption.createMany({
    data: [
      { questionId: q2.id, optionLabel: "A", optionText: "1 and 2 only", isCorrect: false, whyWrong: "Statement 3 is also factually correct." },
      { questionId: q2.id, optionLabel: "B", optionText: "2 and 3 only", isCorrect: false, whyWrong: "Statement 1 is also factually correct." },
      { questionId: q2.id, optionLabel: "C", optionText: "1 and 3 only", isCorrect: false, whyWrong: "Statement 2 is also factually correct." },
      { questionId: q2.id, optionLabel: "D", optionText: "1, 2 and 3", isCorrect: true },
    ],
  });

  // 3. Mains Question 1
  const mq1 = await prisma.mainsQuestion.create({
    data: {
      nodeId: nodes.nodeCommittees.id,
      paper: "GS-2",
      subject: "Polity",
      topic: "Parliamentary Committees",
      directive: "Discuss",
      marks: 10,
      wordLimit: 150,
      allottedMinutes: 7,
      dimensionsGuide: "Examine DRSCs as institutional oversight; discuss referral decline; suggest reforms.",
      questionText:
        "Parliamentary committees are considered the eyes and ears of Parliament. Discuss their significance in ensuring executive accountability and examine reasons for their declining efficacy in recent times.",
    },
  });

  const ma1 = await prisma.mainsAnswer.create({
    data: {
      questionId: mq1.id,
      userId,
      version: 1,
      answerText: `Parliamentary Committees (Article 105) act as the institutional microcosm of Parliament, providing cross-party, specialized, and non-partisan scrutiny of legislative proposals and executive actions.

Significance in Executive Accountability:
1. In-depth Legislative Scrutiny: Departmentally Related Standing Committees (DRSCs) examine bills away from the glare of cameras, enabling candid consensus across treasury and opposition benches.
2. Financial Oversight: Committees like the Public Accounts Committee (PAC) and Estimates Committee ensure post-facto audit of public expenditure assisted by the CAG.
3. Policy Evaluation & Ministerial Vigilance: Committees demand evidence from bureaucrats, holding executive discretion accountable to legislative intent.

Reasons for Declining Efficacy:
1. Bypassing Referral: A steep decline in bills referred to DRSCs—falling from 71% in the 15th Lok Sabha to under 16% in the 17th Lok Sabha.
2. Advisory Nature: Recommendations are purely advisory and often tabled without mandatory parliamentary debates.
3. Lack of Technical Support: Members lack dedicated institutional research staff, diminishing the quality of technical scrutiny.

Way Forward:
As recommended by the 2nd ARC and Venkatachaliah Commission, mandatory referral of significant bills and dedicated parliamentary research officers must be instituted to restore the sanctity of parliamentary oversight.`,
      wordCount: 168,
      timeTakenSec: 410,
      status: "EVALUATED",
      overallScore: 6.5,
    },
  });

  await prisma.answerEvaluation.create({
    data: {
      answerId: ma1.id,
      evaluatorModel: "RankOS UPSC Strict Evaluator v2.4",
      overallScore: 6.5,
      maxMarks: 10.0,
      understandingScore: 7.0,
      structureScore: 7.0,
      dimensionsScore: 6.5,
      constitutionScore: 6.5,
      examplesDataScore: 6.5,
      conclusionScore: 6.0,
      strengths: JSON.stringify([
        "Accurate empirical citation of DRSC referral decline (71% to 16%).",
        "Clear structural division addressing both significance and declining efficacy.",
        "Included constitutional reference (Article 105) and committee precedents (2nd ARC).",
      ]),
      majorWeaknesses: JSON.stringify([
        "Could mention the role of the Committee on Subordinate Legislation regarding delegated lawmaking.",
        "Missed mention of absenteeism and short tenure (1 year) of committee members affecting institutional memory.",
      ]),
      missingDimensions: JSON.stringify([
        "Absence of citizen engagement: Committees rarely hold public hearings like US Congressional hearings.",
        "Partisan polarization: Recent instances of dissent notes based on political party lines.",
      ]),
      betterStructure: "1. Intro (Article 105 + quote) -> 2. Three pillars of accountability (Financial, Legislative, Administrative) -> 3. Empirical hurdles (referrals, tenure, advisory) -> 4. 2nd ARC + UK Select Committee model -> 5. Futuristic synthesis.",
      enrichmentPoints: JSON.stringify([
        "Venkatachaliah Commission recommendation on fixed minimum sitting days",
        "Comparison with UK House of Commons Public Accounts Committee statutory powers",
      ]),
      modelAnswer: "An ideal 10-marker should balance the constitutional mandate under Article 105 with empirical data on bill referral and concrete institutional remedies.",
      improvementSummary: "Strong baseline attempt. Elevating to 7.5+ requires addressing member tenure instability and citing British Select Committee comparisons.",
    },
  });

  return { q1, q2, mq1, ma1 };
}
