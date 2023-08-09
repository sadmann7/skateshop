import { LogOutButtons } from "@/components/auth/logout-buttons"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

export default function SignOutPage() {
  return (
    <Shell className="max-w-xs">
      <PageHeader
        title="Sign out"
        description="Are you sure you want to sign out?"
        size="sm"
        className="text-center"
      />
      <LogOutButtons />
    </Shell>
  )
}
