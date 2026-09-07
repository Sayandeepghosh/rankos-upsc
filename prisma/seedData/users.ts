import { PrismaClient } from "@prisma/client";

export async function seedUsers(prisma: PrismaClient) {
  const user = await prisma.user.create({
    data: {
      id: "demo-user-1",
      name: "Sayan Mukherjee",
      email: "sayan@rankos.ai",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      profile: {
        create: {
          targetYear: 2027,
          attemptNumber: 1,
          currentPhase: "Foundation",
          optionalSubject: "PSIR",
          dailyStudyHours: 6.5,
          wakeTime: "06:00",
          strongSubjects: "Indian Polity,PSIR Political Theory",
          weakSubjects: "Environment & Ecology,Ancient & Medieval History",
          aiProvider: "heuristic",
          aiModel: "UPSC Expert Heuristics v2.4",
        },
      },
    },
  });

  await prisma.examTarget.createMany({
    data: [
      {
        userId: user.id,
        examName: "UPSC CSE 2027 Prelims",
        examStage: "Prelims",
        targetDate: new Date("2027-05-23T09:30:00Z"),
        daysLeft: Math.ceil((new Date("2027-05-23").getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        isPrimary: true,
      },
      {
        userId: user.id,
        examName: "UPSC CSE 2027 Mains",
        examStage: "Mains",
        targetDate: new Date("2027-09-17T09:00:00Z"),
        daysLeft: Math.ceil((new Date("2027-09-17").getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        isPrimary: false,
      },
    ],
  });

  return user;
}
