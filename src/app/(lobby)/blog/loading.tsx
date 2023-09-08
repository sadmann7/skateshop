import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"

export default function BlogLoading() {
  return (
    <Shell className="md:pb-10">
      <PageHeader id="blog-header" aria-labelledby="blog-header-heading">
        <PageHeaderHeading>Blog</PageHeaderHeading>
        <PageHeaderDescription>
          Explore the latest news and updates from the community
        </PageHeaderDescription>
      </PageHeader>
      <Separator className="mb-2.5" />
      <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <article className="flex flex-col space-y-2.5">
              <AspectRatio ratio={16 / 9}>
                <div
                  aria-label="Placeholder"
                  role="img"
                  aria-roledescription="placeholder"
                  className="flex h-full w-full items-center justify-center rounded-lg bg-secondary"
                >
                  <Icons.placeholder
                    className="h-9 w-9 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </AspectRatio>
              <Skeleton className="h-6 w-40" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-4 w-24" />
            </article>
          </div>
        ))}
      </section>
    </Shell>
  )
}
