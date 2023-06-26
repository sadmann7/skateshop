import type { HandleOAuthCallbackParams } from "@clerk/types"

import SSOCallback from "@/components/auth/sso-callback"
import { Shell } from "@/components/shell"
import { env } from "@/env.mjs"

export const runtime = env.NEXTJS_RUNTIME

export interface SSOCallbackPageProps {
  searchParams: HandleOAuthCallbackParams
}

export default function SSOCallbackPage({
  searchParams,
}: SSOCallbackPageProps) {
  return (
    <Shell layout="auth">
      <SSOCallback searchParams={searchParams} />
    </Shell>
  )
}
