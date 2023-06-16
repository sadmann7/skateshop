import { LogOutButton } from "@/components/auth/logout-button"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const runtime = "edge"

export default function SignOutPage() {
  return (
    <Shell layout="dashboard" className="mx-auto w-full sm:w-auto">
      <div className="flex flex-col space-y-2 text-center">
        <Header
          title="Sign out"
          description="Are you sure you want to sign out?"
          size="sm"
        />
        <LogOutButton />
      </div>
    </Shell>
  )
}
