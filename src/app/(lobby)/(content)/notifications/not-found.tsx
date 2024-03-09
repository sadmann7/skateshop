import { ErrorCard } from "@/components/cards/error-card"
import { Shell } from "@/components/shell"

export default function EmailPreferencesNotFound() {
  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard
        title="Email preferences not found"
        description="The token may have expired or you may have already updated your email preferences"
        retryLink="/"
        retryLinkText="Go to Home"
      />
    </Shell>
  )
}
