import { ErrorCard } from "@/components/error-card"
import { Shell } from "@/components/shell"

export default function BlogNotFound() {
  return (
    <Shell layout="centered">
      <ErrorCard
        title="Post not found"
        description="The post you are looking for does not exist"
        retryLink="/blog"
        retryLinkText="Go to Blog"
      />
    </Shell>
  )
}
