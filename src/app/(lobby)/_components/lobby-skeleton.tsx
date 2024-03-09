import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ContentSection } from "@/components/content-section"
import { Shell } from "@/components/shell"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"
import { StoreCardSkeleton } from "@/components/skeletons/store-card-skeleton"

import { CategoryCardSkeleton } from "./category-card-skeleton"

export function LobbySkeleton() {
  return (
    <Shell className="max-w-6xl">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-7 w-44" />
        <h1 className="text-balance font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          An e-commerce skateshop built with everything new in Next.js
        </h1>
        <p className="max-w-[42rem] text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Buy and sell skateboarding gears from independent brands and stores
          around the world with ease
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild>
            <Link href="/products">
              Buy now
              <span className="sr-only">Buy now</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/stores">
              Sell now
              <span className="sr-only">Sell now</span>
            </Link>
          </Button>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </section>
      <ContentSection
        title="Featured products"
        description="Explore products from around the world"
        href="/products"
        linkText="View all products"
        className="pt-8 md:pt-10 lg:pt-12"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </ContentSection>
      <ContentSection
        title="Featured stores"
        description="Explore stores from around the world"
        href="/stores"
        linkText="View all stores"
        className="py-8 md:py-10 lg:py-12"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <StoreCardSkeleton key={i} />
        ))}
      </ContentSection>
    </Shell>
  )
}
