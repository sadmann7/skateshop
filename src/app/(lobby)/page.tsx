import * as React from "react"
import Link from "next/link"
import { Balancer } from "react-wrap-balancer"

import { productCategories } from "@/config/products"
import { getGithubStars } from "@/lib/fetchers/github"
import { getFeaturedProducts } from "@/lib/fetchers/product"
import { getFeaturedStores } from "@/lib/fetchers/store"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryCard } from "@/components/cards/category-card"
import { ContentSection } from "@/components/shells/content-section"
import { Shell } from "@/components/shells/shell"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"
import { StoreCardSkeleton } from "@/components/skeletons/store-card-skeleton"

import { FeaturedProducts } from "./_components/featured-products"
import { FeaturedStores } from "./_components/featured-stores"
import { GithubStars } from "./_components/github-stars"

export default function IndexPage() {
  const productsPromise = getFeaturedProducts()
  const storesPromise = getFeaturedStores()
  const githubStarsPromise = getGithubStars()

  return (
    <Shell className="max-w-6xl pt-0 md:pt-0">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-12 text-center md:pt-32"
      >
        <React.Suspense fallback={<Skeleton className="h-7 w-44" />}>
          <GithubStars githubStarsPromise={githubStarsPromise} />
        </React.Suspense>
        <Balancer
          as="h1"
          className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
        >
          An e-commerce skateshop built with everything new in Next.js
        </Balancer>
        <Balancer className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Buy and sell skateboarding gears from independent brands and stores
          around the world with ease
        </Balancer>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/products" className={cn(buttonVariants())}>
            Buy now
            <span className="sr-only">Buy now</span>
          </Link>
          <Link
            href="/dashboard/stores"
            className={cn(
              buttonVariants({
                variant: "outline",
              })
            )}
          >
            Sell now
            <span className="sr-only">Sell now</span>
          </Link>
        </div>
      </section>
      <section
        id="categories"
        aria-labelledby="categories-heading"
        className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {productCategories.map((category) => (
          <CategoryCard key={category.title} category={category} />
        ))}
      </section>
      <ContentSection
        id="featured-products"
        aria-labelledby="featured-products-heading"
        title="Featured products"
        description="Explore products from around the world"
        href="/products"
        linkText="View all products"
        className="pt-8 md:pt-10 lg:pt-12"
      >
        <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <React.Suspense
            fallback={Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          >
            <FeaturedProducts productsPromise={productsPromise} />
          </React.Suspense>
        </div>
      </ContentSection>
      <ContentSection
        id="featured-stores"
        aria-labelledby="featured-stores-heading"
        title="Featured stores"
        description="Explore stores from around the world"
        href="/stores"
        linkText="View all stores"
        className="py-8 md:py-10 lg:py-12"
      >
        <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <React.Suspense
            fallback={Array.from({ length: 4 }).map((_, i) => (
              <StoreCardSkeleton key={i} />
            ))}
          >
            <FeaturedStores storesPromise={storesPromise} />
          </React.Suspense>
        </div>
      </ContentSection>
    </Shell>
  )
}
