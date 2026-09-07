import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function getActiveUserId(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    return cookieStore.get("rankos_user_id")?.value || null;
  } catch {
    return null;
  }
}

export async function getActiveUser(includeOptions?: any): Promise<any> {
  try {
    const userId = await getActiveUserId();
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: includeOptions,
      });
      if (user) return user;
    }
  } catch (e) {
    // ignore
  }

  return prisma.user.findFirst({
    include: includeOptions,
  });
}
