import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shells/shell"

export default function BlogNotFound() {
  return (
    <Shell variant="centered">
      <ErrorCard
        title="Post not found"
        description="The post you are looking for does not exist"
        retryLink="/blog"
        retryLinkText="Go to Blog"
      />
    </Shell>
  )
}
