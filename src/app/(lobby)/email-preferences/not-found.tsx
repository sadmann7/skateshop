import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shell"

export default function EmailPreferencesNotFound() {
  return (
    <Shell className="mt-20 max-w-md justify-center">
      <ErrorCard
        title="Email preferences not found"
        description="The token may have expired or you may have already updated your email preferences"
        retryLink="/"
        retryLinkText="Go to Home"
      />
    </Shell>
  )
}
