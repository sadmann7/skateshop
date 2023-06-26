import { LogOutButtons } from "@/components/auth/logout-buttons"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import { env } from "@/env.mjs"

export const runtime = env.NEXTJS_RUNTIME

export default function SignOutPage() {
  return (
    <Shell layout="auth" className="max-w-xs">
      <Header
        title="Sign out"
        description="Are you sure you want to sign out?"
        size="sm"
        className="text-center"
      />
      <LogOutButtons />
    </Shell>
  )
}
