import * as React from "react"
import { type Metadata } from "next"
import { env } from "@/env.js"
import { allPosts } from "contentlayer/generated"

import { Separator } from "@/components/ui/separator"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

import { PostCard } from "./_components/post-card"
import { PostCardSkeleton } from "./_components/post-card-skeleton"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Blog",
  description: "Explore the latest news and updates from the community",
}

export default function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Shell className="md:pb-10">
      <PageHeader>
        <PageHeaderHeading>Blog</PageHeaderHeading>
        <PageHeaderDescription>
          Explore the latest news and updates from the community
        </PageHeaderDescription>
      </PageHeader>
      <Separator className="mb-2.5" />
      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <React.Suspense
          fallback={Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        >
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} i={i} />
          ))}
        </React.Suspense>
      </section>
    </Shell>
  )
}
