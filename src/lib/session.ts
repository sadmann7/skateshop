import { authOptions } from "@/lib/auth";
import type { SessionUser } from "@/types";
import { getServerSession } from "next-auth/next";

export async function getCurrentUser(): Promise<SessionUser | undefined> {
  const session = await getServerSession(authOptions);

  return session?.user;
}
