import { type HandleOAuthCallbackParams } from "@clerk/types"

import { SSOCallback } from "@/components/auth/sso-callback"
import { Shell } from "@/components/shells/shell"

export interface SSOCallbackPageProps {
  searchParams: HandleOAuthCallbackParams
}

export default function SSOCallbackPage({
  searchParams,
}: SSOCallbackPageProps) {
  return (
    <Shell className="max-w-lg">
      <SSOCallback searchParams={searchParams} />
    </Shell>
  )
}
