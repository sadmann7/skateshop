import type { SessionUser } from "@/types"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

export async function getCurrentUser(): Promise<SessionUser | undefined> {
  const session = await getServerSession(authOptions)

  return session?.user
}
