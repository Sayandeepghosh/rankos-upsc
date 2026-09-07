import { PrismaClient } from "@prisma/client";

export async function seedSyllabus(prisma: PrismaClient, userId: string) {
  // Papers
  const paperGS1 = await prisma.paper.create({
    data: { code: "GS-1", title: "General Studies I (History, Heritage, Geography, Society)", stage: "Mains", order: 1 },
  });
  const paperGS2 = await prisma.paper.create({
    data: { code: "GS-2", title: "General Studies II (Governance, Constitution, Polity, Social Justice, IR)", stage: "Mains", order: 2 },
  });
  const paperGS3 = await prisma.paper.create({
    data: { code: "GS-3", title: "General Studies III (Technology, Economic Development, Biodiversity, Security)", stage: "Mains", order: 3 },
  });
  const paperGS4 = await prisma.paper.create({
    data: { code: "GS-4", title: "General Studies IV (Ethics, Integrity, and Aptitude)", stage: "Mains", order: 4 },
  });
  const paperCSAT = await prisma.paper.create({
    data: { code: "CSAT", title: "Prelims Paper II (CSAT - Aptitude & Comprehension)", stage: "Prelims", order: 5 },
  });
  const paperPSIR1 = await prisma.paper.create({
    data: { code: "PSIR-1", title: "PSIR Optional Paper I (Political Theory & Indian Politics)", stage: "Optional", order: 6 },
  });
  const paperPSIR2 = await prisma.paper.create({
    data: { code: "PSIR-2", title: "PSIR Optional Paper II (Comparative Politics & International Relations)", stage: "Optional", order: 7 },
  });
  const paperEssay = await prisma.paper.create({
    data: { code: "ESSAY", title: "UPSC Essay Paper", stage: "Essay", order: 8 },
  });

  // Subjects
  const subPolity = await prisma.subject.create({
    data: { paperId: paperGS2.id, code: "POLITY", name: "Indian Polity & Constitution", color: "#3b82f6", weightage: 1.2 },
  });
  const subEconomy = await prisma.subject.create({
    data: { paperId: paperGS3.id, code: "ECONOMY", name: "Indian Economy & Macroeconomics", color: "#10b981", weightage: 1.1 },
  });
  const subEnv = await prisma.subject.create({
    data: { paperId: paperGS3.id, code: "ENVIRONMENT", name: "Environment, Ecology & Climate", color: "#059669", weightage: 1.3 },
  });
  const subHistory = await prisma.subject.create({
    data: { paperId: paperGS1.id, code: "MODERN_HISTORY", name: "Modern Indian History", color: "#f59e0b", weightage: 1.0 },
  });
  const subEthics = await prisma.subject.create({
    data: { paperId: paperGS4.id, code: "ETHICS", name: "Ethics & Integrity", color: "#8b5cf6", weightage: 1.0 },
  });
  const subPSIRTheory = await prisma.subject.create({
    data: { paperId: paperPSIR1.id, code: "PSIR_THEORY", name: "Political Theory & Western Thinkers", color: "#ec4899", weightage: 1.4 },
  });

  // Syllabus Nodes
  const nodeParliamentUnit = await prisma.syllabusNode.create({
    data: {
      paperId: paperGS2.id,
      subjectId: subPolity.id,
      code: "GS2-POL-PARL",
      title: "Parliament and State Legislatures",
      nodeType: "Unit",
      order: 1,
      importance: "High",
      pyqFrequency: 18,
      description: "Structure, functioning, conduct of business, powers & privileges and issues arising out of these.",
    },
  });

  const nodeCommittees = await prisma.syllabusNode.create({
    data: {
      paperId: paperGS2.id,
      subjectId: subPolity.id,
      parentId: nodeParliamentUnit.id,
      code: "GS2-POL-PARL-COMM",
      title: "Parliamentary Committees & Executive Accountability",
      nodeType: "Topic",
      order: 1,
      importance: "High",
      pyqFrequency: 9,
      description: "Departmentally Related Standing Committees, PAC, Committee on Estimates, declining referral rates.",
    },
  });

  const nodeFederalUnit = await prisma.syllabusNode.create({
    data: {
      paperId: paperGS2.id,
      subjectId: subPolity.id,
      code: "GS2-POL-FED",
      title: "Federal System & Centre-State Relations",
      nodeType: "Unit",
      order: 2,
      importance: "High",
      pyqFrequency: 15,
      description: "Issues and challenges pertaining to federal structure, devolution of powers.",
    },
  });

  const nodeGovernor = await prisma.syllabusNode.create({
    data: {
      paperId: paperGS2.id,
      subjectId: subPolity.id,
      parentId: nodeFederalUnit.id,
      code: "GS2-POL-FED-GOV",
      title: "Governor Discretionary Powers & Article 200/356",
      nodeType: "Topic",
      order: 1,
      importance: "High",
      pyqFrequency: 8,
    },
  });

  const nodeEnvUnit = await prisma.syllabusNode.create({
    data: {
      paperId: paperGS3.id,
      subjectId: subEnv.id,
      code: "GS3-ENV-BIO",
      title: "Biodiversity & Wildlife Conservation",
      nodeType: "Unit",
      order: 1,
      importance: "High",
      pyqFrequency: 22,
    },
  });

  const nodeWPA = await prisma.syllabusNode.create({
    data: {
      paperId: paperGS3.id,
      subjectId: subEnv.id,
      parentId: nodeEnvUnit.id,
      code: "GS3-ENV-BIO-WPA",
      title: "Wildlife Protection Act 1972 & 2022 Amendments (CITES)",
      nodeType: "Topic",
      order: 1,
      importance: "High",
      pyqFrequency: 7,
    },
  });

  const nodePSIRUnit = await prisma.syllabusNode.create({
    data: {
      paperId: paperPSIR1.id,
      subjectId: subPSIRTheory.id,
      code: "PSIR1A-WPT",
      title: "Western Political Thought",
      nodeType: "Unit",
      order: 1,
      importance: "High",
      pyqFrequency: 25,
    },
  });

  const nodePlatoTopic = await prisma.syllabusNode.create({
    data: {
      paperId: paperPSIR1.id,
      subjectId: subPSIRTheory.id,
      parentId: nodePSIRUnit.id,
      code: "PSIR1A-WPT-PLATO",
      title: "Plato: Theory of Ideas, Justice & Philosopher King",
      nodeType: "Topic",
      order: 1,
      importance: "High",
      pyqFrequency: 11,
    },
  });

  const nodeRawlsTopic = await prisma.syllabusNode.create({
    data: {
      paperId: paperPSIR1.id,
      subjectId: subPSIRTheory.id,
      parentId: nodePSIRUnit.id,
      code: "PSIR1A-WPT-RAWLS",
      title: "John Rawls: Justice as Fairness & Difference Principle",
      nodeType: "Topic",
      order: 2,
      importance: "High",
      pyqFrequency: 14,
    },
  });

  // Topic Progress
  await prisma.topicProgress.createMany({
    data: [
      {
        nodeId: nodeCommittees.id,
        userId,
        lifecycleStage: 7,
        stageName: "PYQ Practiced",
        masteryScore: 78.5,
        recallScore: 82.0,
        testScore: 85.0,
        answerScore: 72.0,
        revisionHealth: 90.0,
        pyqPerformance: 80.0,
        confidence: "High",
        notesStatus: "Completed",
        pyqsAttempted: 6,
        questionsAnswered: 24,
        accuracy: 82.5,
        lastStudiedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextRevisionAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        nodeId: nodeGovernor.id,
        userId,
        lifecycleStage: 6,
        stageName: "Revision 2",
        masteryScore: 72.0,
        recallScore: 70.0,
        testScore: 75.0,
        answerScore: 68.0,
        revisionHealth: 85.0,
        pyqPerformance: 70.0,
        confidence: "Medium",
        notesStatus: "Completed",
        pyqsAttempted: 4,
        questionsAnswered: 18,
        accuracy: 75.0,
        lastStudiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        nextRevisionAt: new Date(),
      },
      {
        nodeId: nodeWPA.id,
        userId,
        lifecycleStage: 10,
        stageName: "Weakness Detected",
        masteryScore: 42.0,
        recallScore: 35.0,
        testScore: 45.0,
        answerScore: 40.0,
        revisionHealth: 30.0,
        pyqPerformance: 38.0,
        confidence: "Low",
        notesStatus: "Draft",
        pyqsAttempted: 5,
        questionsAnswered: 15,
        accuracy: 42.0,
        lastStudiedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        nextRevisionAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        nodeId: nodePlatoTopic.id,
        userId,
        lifecycleStage: 8,
        stageName: "MCQ Tested",
        masteryScore: 84.0,
        recallScore: 88.0,
        testScore: 90.0,
        answerScore: 80.0,
        revisionHealth: 92.0,
        pyqPerformance: 85.0,
        confidence: "High",
        notesStatus: "SheetGenerated",
        pyqsAttempted: 8,
        questionsAnswered: 12,
        accuracy: 89.0,
        lastStudiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nextRevisionAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      },
      {
        nodeId: nodeRawlsTopic.id,
        userId,
        lifecycleStage: 9,
        stageName: "Mains Answer Practiced",
        masteryScore: 86.5,
        recallScore: 90.0,
        testScore: 85.0,
        answerScore: 85.0,
        revisionHealth: 95.0,
        pyqPerformance: 88.0,
        confidence: "High",
        notesStatus: "SheetGenerated",
        pyqsAttempted: 7,
        questionsAnswered: 10,
        accuracy: 91.0,
        lastStudiedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        nextRevisionAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  return {
    nodeCommittees,
    nodeGovernor,
    nodeWPA,
    nodePlatoTopic,
    nodeRawlsTopic,
  };
}
