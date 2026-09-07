import { PrismaClient } from "@prisma/client";

export async function seedActivities(
  prisma: PrismaClient,
  userId: string,
  nodes: {
    nodeCommittees: any;
    nodeGovernor: any;
    nodeWPA: any;
    nodePlatoTopic: any;
    nodeRawlsTopic: any;
  }
) {
  // 1. Current Affairs
  const caItem = await prisma.currentAffair.create({
    data: {
      title: "Supreme Court Clarifies Governor Powers on Withholding Assent to Bills",
      source: "The Hindu & LiveLaw",
      category: "Polity",
      summary:
        "A three-judge bench of the Supreme Court held that a Governor cannot sit indefinitely on bills passed by the state legislature. Under Article 200, if the Governor chooses to withhold assent, they must immediately return the bill to the House with a message for reconsideration.",
      context:
        "Petitions filed by State Governments of Punjab, Tamil Nadu, and Kerala alleging that Governors were stalling crucial welfare and university legislations.",
      whyItMatters:
        "Directly safeguards parliamentary democracy, federalism, and the principle that unelected Governors cannot exercise pocket vetoes over elected legislatures.",
      prelimsAngle:
        "Article 200 options available to the Governor: Assent, Withhold, Return for reconsideration, Reserve for President. Note: Governor cannot return Money Bills.",
      mainsAngle:
        "Evaluate the doctrine of constitutional morality and gubernatorial discretion. Cite Sarkaria (1988) and Punchhi (2010) recommendations on a 6-month timeline.",
      psirAngle:
        "Tension between centralized union structure and state autonomy in Indian Government and Politics (IGP). Relate to Granville Austin's 'Cooperative Federalism'.",
      articlesReferenced: "Article 163, Article 200, Article 201, Article 356",
      institutions: "Supreme Court of India, Governor's Secretariat, State Legislative Assemblies",
      keywords: "Pocket veto, Article 200, Assent to bills, Cooperative federalism, Punchhi Commission",
      revisionDueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.currentAffairTopicLink.create({
    data: {
      caId: caItem.id,
      nodeId: nodes.nodeGovernor.id,
      approvedBy: "User",
      relevance: "High",
    },
  });

  // 2. Mistake Vault
  await prisma.mistake.createMany({
    data: [
      {
        userId,
        nodeId: nodes.nodeWPA.id,
        source: "MCQ Quiz",
        questionText: "Wildlife Protection Amendment Act 2022 schedule reduction details.",
        userResponse: "Selected 6 schedules retained with added CITES appendice schedule.",
        correctResponse: "Reduced schedules from 6 to 4; vermin schedule removed completely.",
        reasonForError: "Did not review the 2022 statutory gazette notification; confused with older 1972 six-schedule structure.",
        mistakeType: "Knowledge gap",
        topic: "Wildlife Protection Act",
        subject: "Environment",
        repetitionCount: 2,
        correctiveAction: "Read PMF IAS Environment chapter on Wildlife Protection Act and prepare a one-page comparison table.",
        nextReviewDate: new Date(),
        status: "OPEN",
      },
      {
        userId,
        nodeId: nodes.nodeGovernor.id,
        source: "Mock Test",
        questionText: "Discretionary powers of Governor regarding appointment of Council of Ministers.",
        userResponse: "Selected statement 2 as discretionary power.",
        correctResponse: "Ministers are appointed strictly on advice of Chief Minister (Article 164).",
        reasonForError: "Rushed through question under 45-second time pressure; failed to read 'appointment of ministers' carefully.",
        mistakeType: "Misread question",
        topic: "Governor's Discretion",
        subject: "Polity",
        repetitionCount: 1,
        correctiveAction: "Practice deliberate question reading and highlight negative/absolute terms before bubbling.",
        nextReviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "REVIEWED",
      },
    ],
  });

  // 3. Today's Mission Tasks
  await prisma.studyTask.createMany({
    data: [
      {
        userId,
        nodeId: nodes.nodeCommittees.id,
        title: "Parliamentary Standing Committees & Scrutiny",
        subject: "Polity",
        topic: "Parliamentary Committees",
        reason: "Core GS-2 high-yield area: tested 9 times in UPSC Mains. Reviewing scrutiny mechanism.",
        taskType: "Learning",
        priority: "High",
        priorityScore: 88.0,
        estimatedMinutes: 90,
        actualMinutes: 90,
        timeSlot: "08:00 - 09:30",
        status: "COMPLETED",
        expectedOutput: "Review decline of bills referred to committees (from 71% in 15th LS to 16% in 17th LS).",
      },
      {
        userId,
        nodeId: nodes.nodeCommittees.id,
        title: "Polity PYQ Drill: Parliamentary Committees",
        subject: "Polity",
        topic: "Parliamentary Committees PYQs",
        reason: "Active retrieval: consolidate morning learning with 5 standard UPSC Prelims & Mains questions.",
        taskType: "PYQ Practice",
        priority: "High",
        priorityScore: 85.0,
        estimatedMinutes: 45,
        actualMinutes: 45,
        timeSlot: "09:45 - 10:30",
        status: "COMPLETED",
        expectedOutput: "Attempt 2021 and 2018 Mains PYQs on Standing Committees.",
      },
      {
        userId,
        nodeId: nodes.nodePlatoTopic.id,
        title: "PSIR: Plato's Philosopher King & Popper's Critique",
        subject: "PSIR",
        topic: "Plato: Theory of Justice",
        reason: "Scheduled optional block: high-frequency theme in Paper-I Section A.",
        taskType: "Learning",
        priority: "Urgent",
        priorityScore: 92.0,
        estimatedMinutes: 60,
        actualMinutes: 0,
        timeSlot: "11:00 - 12:00",
        status: "IN_PROGRESS",
        expectedOutput: "Understand Karl Popper's labeling of Plato as the 'first fascist' in Open Society.",
      },
      {
        userId,
        nodeId: nodes.nodeGovernor.id,
        title: "Current Affairs Revision: Governor's Assent Timeline",
        subject: "Polity",
        topic: "Federalism & Governor",
        reason: "Supreme Court 2023 Punjab judgment on Article 200: must consolidate static-dynamic link.",
        taskType: "Revision",
        priority: "High",
        priorityScore: 80.0,
        estimatedMinutes: 45,
        actualMinutes: 0,
        timeSlot: "14:00 - 14:45",
        status: "PENDING",
        expectedOutput: "Link Article 200 proviso with Supreme Court observations on 'as soon as possible'.",
      },
      {
        userId,
        nodeId: nodes.nodeWPA.id,
        title: "Targeted Weakness Remediation: Wildlife Protection Act Schedules",
        subject: "Environment",
        topic: "WPA 1972 & 2022 Amendment",
        reason: "Personalized Weakness Engine alert: accuracy in Environment dropped to 42% on recent mock.",
        taskType: "MCQ Practice",
        priority: "Urgent",
        priorityScore: 95.0,
        estimatedMinutes: 45,
        actualMinutes: 0,
        timeSlot: "16:00 - 16:45",
        status: "PENDING",
        expectedOutput: "Solve 15 MCQs distinguishing Schedule I (highest protection) vs Schedule II, III, IV.",
      },
      {
        userId,
        nodeId: nodes.nodeCommittees.id,
        title: "Mains Answer Writing: Parliamentary Executive Accountability",
        subject: "Polity",
        topic: "Parliamentary Committees",
        reason: "Daily answer writing habit: 10-marker on parliamentary oversight.",
        taskType: "Answer Writing",
        priority: "High",
        priorityScore: 84.0,
        estimatedMinutes: 30,
        actualMinutes: 0,
        timeSlot: "18:00 - 18:30",
        status: "PENDING",
        expectedOutput: "Submit 150-word answer for AI strict evaluation.",
      },
    ],
  });

  // 4. Study Sessions
  await prisma.studySession.createMany({
    data: [
      {
        userId,
        subject: "Polity",
        topic: "Parliamentary Standing Committees",
        sessionType: "DeepWork90",
        plannedMinutes: 90,
        actualMinutes: 90,
        distractions: 1,
        rating: 5,
        notes: "High focus session. Consolidated difference between Standing and Select Committees.",
        startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        endedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      },
      {
        userId,
        subject: "Polity",
        topic: "Polity PYQs",
        sessionType: "Pomodoro50",
        plannedMinutes: 45,
        actualMinutes: 45,
        distractions: 0,
        rating: 4,
        notes: "Solved 12 MCQs and 1 10-marker outline.",
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endedAt: new Date(Date.now() - 1.25 * 60 * 60 * 1000),
      },
    ],
  });

  // 5. Revision Schedules
  await prisma.revisionSchedule.createMany({
    data: [
      {
        userId,
        nodeId: nodes.nodeGovernor.id,
        subject: "Polity",
        topic: "Governor's Discretionary Powers (Article 163 & 200)",
        revisionNumber: 2,
        intervalDays: 7,
        scheduledDate: new Date(),
        lastRevisionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: "DUE",
        recallHealth: 88.0,
      },
      {
        userId,
        nodeId: nodes.nodeWPA.id,
        subject: "Environment",
        topic: "Wildlife Protection Act Schedules & CITES Appendices",
        revisionNumber: 1,
        intervalDays: 3,
        scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastRevisionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "OVERDUE",
        recallHealth: 32.0,
      },
      {
        userId,
        nodeId: nodes.nodePlatoTopic.id,
        subject: "PSIR",
        topic: "Plato: Theory of Justice & Philosopher King",
        revisionNumber: 3,
        intervalDays: 16,
        scheduledDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        lastRevisionDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        status: "DUE",
        recallHealth: 94.0,
      },
      {
        userId,
        nodeId: nodes.nodeRawlsTopic.id,
        subject: "PSIR",
        topic: "John Rawls: Veil of Ignorance & Difference Principle",
        revisionNumber: 4,
        intervalDays: 35,
        scheduledDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        lastRevisionDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
        status: "DUE",
        recallHealth: 96.0,
      },
    ],
  });

  // 6. Mock Test
  const mockTest = await prisma.test.create({
    data: {
      title: "GS-1 Full Length Mock #04 (All India Simulation)",
      testType: "Full Mock",
      paper: "GS-1",
      totalMarks: 200,
      durationMins: 120,
      questionsCount: 100,
    },
  });

  await prisma.testAttempt.create({
    data: {
      testId: mockTest.id,
      userId,
      totalQuestions: 100,
      attemptedQuestions: 84,
      correctQuestions: 54,
      incorrectQuestions: 30,
      skippedQuestions: 16,
      rawScore: 108.0,
      negativeMarks: 19.8,
      netScore: 88.2,
      accuracyRate: 64.3,
      timeSpentSec: 7140,
      aiDiagnosis:
        "Score of 88.2/200 puts you in top 15th percentile, but negative deduction of -19.8 marks pulled you below safe 105+ zone. Accuracy when Certain is 84%, but drops to 38% in 50:50 Eliminations.",
      topMistakes: JSON.stringify([
        "Aggressive over-attempting in Environment (11 attempted, 6 incorrect).",
        "Chronology confusion in Modern History mass movements.",
        "Misinterpretation of Not Correct question stem in 2 questions.",
        "Blind guesses in CSAT comprehension.",
        "Overthinking in Polity basic structure questions.",
      ]),
      correctivePlan:
        "7-Day Recovery Roadmap:\nDay 1-2: Environment WPA & National Parks revision sheets.\nDay 3: Modern History timeline flashcard drill.\nDay 4: Elimination risk control: halt attempts when below 50% certainty.\nDay 5-6: 50 sectional MCQs on Polity & Economy.\nDay 7: Re-attempt Full Mock with strict target of < 18 negatives.",
    },
  });

  // 7. PYQ Lab
  await prisma.pYQ.createMany({
    data: [
      {
        stage: "Prelims",
        paper: "GS-1",
        year: 2021,
        questionNumber: 42,
        marks: 2,
        subject: "Polity",
        topic: "Parliamentary Committees",
        recurringTheme: "Delegated Legislation & Parliamentary Scrutiny",
        frequencyCount: 9,
        trend: "Rising",
        questionText: "Which Parliamentary Committee scrutinizes rules and regulations framed under delegated legislation?",
      },
      {
        stage: "Mains",
        paper: "GS-2",
        year: 2023,
        questionNumber: 3,
        marks: 10,
        subject: "Polity",
        directive: "Discuss",
        topic: "Governor's Discretion",
        recurringTheme: "Governor's Role in State Legislation",
        frequencyCount: 8,
        trend: "Rising",
        questionText: "Discuss the essential conditions for exercise of the legislative-powers by the Governor. What has been the Supreme Court's view on indefinite delay in assenting to bills?",
      },
      {
        stage: "Optional",
        paper: "PSIR-1",
        year: 2022,
        questionNumber: 2,
        marks: 20,
        subject: "PSIR",
        directive: "Critically Analyse",
        topic: "John Rawls",
        recurringTheme: "Egalitarian Liberalism vs Libertarianism",
        frequencyCount: 14,
        trend: "Stable",
        questionText: "Critically analyse John Rawls' concept of Justice as Fairness. How far does Nozick's entitlement theory provide an alternative perspective?",
      },
    ],
  });

  // 8. Essay Lab
  await prisma.essay.create({
    data: {
      title: "Wisdom finds truth in the clash of differing opinions.",
      theme: "Philosophical / Democratic Discourse",
      year: 2023,
      isPYQ: true,
      quoteBank: JSON.stringify([
        { quote: "He who knows only his own side of the case knows little of that.", author: "John Stuart Mill" },
        { quote: "Where all think alike, no one thinks very much.", author: "Walter Lippmann" },
      ]),
      anecdoteBank: JSON.stringify([
        { title: "The Constituent Assembly Debates", story: "How Ambedkar, Patel, and Nehru synthesized fiercely opposing viewpoints into the world's longest living constitution." },
      ]),
      dimensionsJson: JSON.stringify([
        "Philosophical: Dialectics of Socrates and Hegel",
        "Political: Parliamentary debate vs authoritarian monoliths",
        "Scientific: Peer review and falsifiability (Karl Popper)",
        "Socio-cultural: Syncretic tradition of India (Amartya Sen)",
        "Global: Multilateralism vs unilateral hegemony",
        "Individual: Intellectual humility and cognitive biases",
      ]),
    },
  });

  // 9. Ethics Case
  await prisma.ethicsCase.create({
    data: {
      title: "Conflict of Interest in Medical Equipment Procurement",
      scenario:
        "You are the District Magistrate of an aspirational district. A deadly epidemic breaks out, and emergency ventilators are needed. The fastest supplier is a manufacturing firm owned by your first cousin. Delaying procurement by even 48 hours to float a formal tender will likely cause fatalities. Your cousin offers equipment at competitive government rates.",
      coreTheme: "Conflict of Interest, Probity in Public Life, Duty vs Nepotism",
      stakeholders: JSON.stringify(["District Magistrate (Self)", "Vulnerable Patients / Public", "District Administration", "First Cousin Firm", "State Health Department"]),
      ethicalDilemmas: JSON.stringify([
        "Utilitarian urgency (saving human lives) vs Deontological probity (avoiding conflict of interest).",
        "Administrative expediency vs procedural transparency.",
        "Public trust in governance vs immediate crisis alleviation.",
      ]),
      optionsAndCons: JSON.stringify([
        { option: "Procure directly from cousin firm immediately without disclosure.", verdict: "Unethical: violates CCS Conduct Rules and destroys public confidence." },
        { option: "Wait for standard 14-day tender procedure.", verdict: "Inhumane: prioritizes procedural safety over patient survival." },
        { option: "Emergency procurement committee + full proactive disclosure to Chief Secretary + third-party price certification.", verdict: "Ethical & Optimal: balances life-saving urgency with institutional transparency." },
      ]),
      bestActionModel: "Recuse yourself from price negotiation; form a multi-member emergency technical committee led by CMO; disclose relationship in writing to Principal Secretary (Health); procure at verified CGHS rates.",
      quotesToUse: "In public affairs, not only must justice be done, but it must manifestly and undoubtedly be seen to be done. (Lord Hewart)",
    },
  });

  // 10. Resources
  await prisma.resource.createMany({
    data: [
      {
        title: "Indian Polity (7th Edition) by M. Laxmikanth",
        resourceType: "Book",
        subject: "Polity",
        source: "McGraw Hill",
        priority: "Essential",
        status: "IN_PROGRESS",
        pagesRead: 480,
        totalPages: 850,
        estimatedMins: 2400,
        notes: "Primary anchor for GS-2 and Prelims Polity. Focus on Articles, schedules, and statutory bodies.",
      },
      {
        title: "A History of Political Thought: Plato to Marx by Subrata Mukherjee & Sushila Ramaswamy",
        resourceType: "Book",
        subject: "PSIR",
        source: "PHI Learning",
        priority: "Essential",
        status: "IN_PROGRESS",
        pagesRead: 290,
        totalPages: 540,
        estimatedMins: 1800,
        notes: "Comprehensive textual coverage for PSIR Paper-1 Section A Western Thinkers.",
      },
      {
        title: "PMF IAS Environment & Ecology",
        resourceType: "Book",
        subject: "Environment",
        source: "PMF IAS Publications",
        priority: "Essential",
        status: "IN_PROGRESS",
        pagesRead: 180,
        totalPages: 460,
        estimatedMins: 1400,
        notes: "Crucial for species protection, climate treaties, and protected area maps.",
      },
    ],
  });

  // 11. Readiness Metrics
  await prisma.readinessMetric.createMany({
    data: [
      {
        metricType: "PRELIMS",
        score: 68.0,
        targetBand: "Consolidation",
        trajectory: "Improving",
        positiveFactors: JSON.stringify([
          "Consistent Polity accuracy (>82%) in mock drills",
          "Completed 65% of GS-1 core syllabus tree",
          "Attempted 140+ official PYQs across 2018-2023",
        ]),
        negativeFactors: JSON.stringify([
          "Environment MCQ accuracy lags at 42%",
          "Negative marking deduction averaging -19.8 marks in mocks",
          "Pending revision backlog in Modern History",
        ]),
      },
      {
        metricType: "MAINS",
        score: 62.5,
        targetBand: "Consolidation",
        trajectory: "Improving",
        positiveFactors: JSON.stringify([
          "Strong introduction and structured conclusion in GS-2 answers",
          "Consistently includes constitutional articles (105, 163, 200)",
          "Adheres to 7-minute time budget for 10-markers",
        ]),
        negativeFactors: JSON.stringify([
          "Answers lack empirical committee references (2nd ARC, Punchhi)",
          "GS-3 Economy answers require more Economic Survey data points",
        ]),
      },
      {
        metricType: "PSIR",
        score: 72.0,
        targetBand: "Competitive",
        trajectory: "Improving",
        positiveFactors: JSON.stringify([
          "Deep grasp of Western Thinkers (Plato, Aristotle, Rawls)",
          "Integrates scholars like Karl Popper, Sabine, and Barker",
          "Completed 70% of Paper I Section A syllabus",
        ]),
        negativeFactors: JSON.stringify([
          "Paper II International Relations contemporary linking needs update",
          "Indian political thought (Kautilya, Gandhi) pending revision",
        ]),
      },
      {
        metricType: "ESSAY",
        score: 65.0,
        targetBand: "Consolidation",
        trajectory: "Stable",
        positiveFactors: JSON.stringify([
          "Brainstorms 6+ distinct dimensions for philosophical quotes",
          "Effective quote bank utilization (Mill, Ambedkar, Gandhi)",
        ]),
        negativeFactors: JSON.stringify([
          "Needs smoother transitions between socio-economic and ethical arguments",
        ]),
      },
      {
        metricType: "OVERALL",
        score: 66.8,
        targetBand: "Competitive",
        trajectory: "Improving",
        positiveFactors: JSON.stringify([
          "High study consistency: 5.8 hours daily average over past 3 weeks",
          "Active recall discipline protecting high-yield polity nodes",
        ]),
        negativeFactors: JSON.stringify([
          "Environment weakness drag factor active",
          "Mock test negative marking penalty",
        ]),
      },
    ],
  });

  // 12. AI Insights
  await prisma.aIInsight.createMany({
    data: [
      {
        userId,
        category: "Weakness",
        title: "Environment Accuracy Alert",
        insight: "Your accuracy in Environment & Biodiversity has dropped to 42% across the last 3 test sessions.",
        actionable: "Complete the WPA schedules flashcard review today; pause novel topics until accuracy crosses 65%.",
        priority: "High",
      },
      {
        userId,
        category: "Schedule",
        title: "Spaced Repetition Health Degradation",
        insight: "Governor's Discretionary Powers has reached Day 7 since last recall. Retention decay is currently at 12%.",
        actionable: "Execute the 15-minute recall prompt scheduled in Today's Mission.",
        priority: "Medium",
      },
      {
        userId,
        category: "Recommendation",
        title: "PSIR Value Addition Opportunity",
        insight: "Recent Mains answers on Political Theory scored 6.5/10. Incorporating G.A. Cohen's critique of Rawls will unlock 7.5+ band.",
        actionable: "Review the Rawls vs Nozick comparison card in PSIR Lab.",
        priority: "Medium",
      },
    ],
  });

  // 13. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId,
        title: "3 Urgent Revisions Due Today",
        message: "Polity: Governor's Discretion, Environment: WPA, and PSIR: Plato's Justice need quick active recall.",
        type: "REVISION",
        link: "/revision",
      },
      {
        userId,
        title: "Weakness Alert Detected",
        message: "Environment MCQ accuracy dropped below threshold (42%). Targeted drill generated.",
        type: "MISTAKE",
        link: "/mistakes",
      },
      {
        userId,
        title: "Full Mock Test Scheduled",
        message: "GS-1 Full Length Mock #05 is scheduled for this Sunday 09:30 AM.",
        type: "TEST",
        link: "/tests",
      },
    ],
  });

  // 14. Analytics Snapshot
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    await prisma.analyticsSnapshot.create({
      data: {
        userId,
        date: day,
        studyMinutes: 320 + Math.floor(Math.random() * 80) - (i === 2 ? 100 : 0),
        tasksCompleted: 4 + Math.floor(Math.random() * 3),
        mcqsSolved: 20 + Math.floor(Math.random() * 20),
        mcqAccuracy: 62 + Math.floor(Math.random() * 20),
        mainsScoreAvg: 6.2 + Math.random() * 0.8,
        revisionCount: 2 + Math.floor(Math.random() * 3),
        overallReadiness: 64 + (6 - i) * 0.5,
      },
    });
  }
}
