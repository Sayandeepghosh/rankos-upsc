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

export async function getActiveUser(options?: any): Promise<any> {
  // Gracefully handle both { include: { ... } } and direct { profile: true, ... }
  let includeMap: any = undefined;
  if (options) {
    includeMap = options.include !== undefined ? options.include : options;
  }

  try {
    const userId = await getActiveUserId();
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        ...(includeMap ? { include: includeMap } : {}),
      });
      if (user) return user;
    }
  } catch (e) {
    // ignore
  }

  return null;
}
