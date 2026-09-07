import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seedData/users";
import { seedSyllabus } from "./seedData/syllabus";
import { seedQuestions } from "./seedData/questions";
import { seedPSIR } from "./seedData/psir";
import { seedActivities } from "./seedData/activities";

const prisma = new PrismaClient();

async function main() {
  console.log("?? Seeding RankOS database...");

  // Clean existing tables
  await prisma.notification.deleteMany();
  await prisma.aIInsight.deleteMany();
  await prisma.analyticsSnapshot.deleteMany();
  await prisma.readinessMetric.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.mistake.deleteMany();
  await prisma.noteLink.deleteMany();
  await prisma.note.deleteMany();
  await prisma.currentAffairTopicLink.deleteMany();
  await prisma.currentAffair.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.thinker.deleteMany();
  await prisma.optionalTopic.deleteMany();
  await prisma.ethicsCase.deleteMany();
  await prisma.essayAttempt.deleteMany();
  await prisma.essay.deleteMany();
  await prisma.answerEvaluation.deleteMany();
  await prisma.mainsAnswer.deleteMany();
  await prisma.mainsQuestion.deleteMany();
  await prisma.pYQ.deleteMany();
  await prisma.testAnswer.deleteMany();
  await prisma.testAttempt.deleteMany();
  await prisma.test.deleteMany();
  await prisma.questionAttempt.deleteMany();
  await prisma.questionOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.recallAttempt.deleteMany();
  await prisma.revisionAttempt.deleteMany();
  await prisma.revisionSchedule.deleteMany();
  await prisma.studyPlan.deleteMany();
  await prisma.studySession.deleteMany();
  await prisma.studyTask.deleteMany();
  await prisma.topicProgress.deleteMany();
  await prisma.syllabusNode.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.paper.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.examTarget.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.user.deleteMany();

  const user = await seedUsers(prisma);
  const nodes = await seedSyllabus(prisma, user.id);
  await seedQuestions(prisma, user.id, nodes);
  await seedPSIR(prisma);
  await seedActivities(prisma, user.id, nodes);

  console.log("? RankOS database successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
