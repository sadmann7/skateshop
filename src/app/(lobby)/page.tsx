import * as React from "react"
import { unstable_cache as cache } from "next/cache"
import Link from "next/link"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { desc, eq, sql } from "drizzle-orm"
import { Balancer } from "react-wrap-balancer"

import { productCategories } from "@/config/products"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryCard } from "@/components/cards/category-card"
import { ProductCard } from "@/components/cards/product-card"
import { StoreCard } from "@/components/cards/store-card"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shells/shell"
import { ProductCardSkeleton } from "@/components/skeletons/product-card-skeleton"
import { StoreCardSkeleton } from "@/components/skeletons/store-card-skeleton"

export default async function IndexPage() {
  // See the unstable_cache API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_cache
  const someProducts = await cache(
    async () => {
      return db
        .select({
          id: products.id,
          name: products.name,
          images: products.images,
          category: products.category,
          price: products.price,
          inventory: products.inventory,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(products)
        .limit(8)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .groupBy(products.id)
        .orderBy(
          desc(sql<number>`count(${stores.stripeAccountId})`),
          desc(sql<number>`count(${products.images})`),
          desc(products.createdAt)
        )
    },
    ["lobby-products"],
    {
      revalidate: 3600,
      tags: ["lobby-products"],
    }
  )()

  const someStores = await cache(
    async () => {
      return db
        .select({
          id: stores.id,
          name: stores.name,
          description: stores.description,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(stores)
        .limit(4)
        .leftJoin(products, eq(products.storeId, stores.id))
        .groupBy(stores.id)
        .orderBy(desc(stores.active), desc(sql<number>`count(*)`))
    },
    ["lobby-stores"],
    {
      revalidate: 3600,
      tags: ["lobby-stores"],
    }
  )()

  async function getGithubStars(): Promise<number | null> {
    try {
      const response = await fetch(
        "https://api.github.com/repos/sadmann7/skateshop",
        {
          headers: {
            Accept: "application/vnd.github+json",
          },
          next: {
            revalidate: 60,
          },
        }
      )

      if (!response.ok) {
        return null
      }

      const data = (await response.json()) as { stargazers_count: number }

      return data.stargazers_count
    } catch (err) {
      console.error(err)
      return null
    }
  }

  const githubStars = await getGithubStars()

  return (
    <Shell className="max-w-6xl pt-0 md:pt-0">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 py-12 text-center md:pt-32"
      >
        <React.Suspense fallback={<Skeleton className="h-7 w-44" />}>
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <Badge
              aria-hidden="true"
              className="rounded-md px-3.5 py-1.5"
              variant="secondary"
            >
              <Icons.gitHub className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
              {githubStars} stars on GitHub
            </Badge>
            <span className="sr-only">GitHub</span>
          </Link>
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
      <section
        id="featured-products"
        aria-labelledby="featured-products-heading"
        className="space-y-6 pt-8 md:pt-10 lg:pt-12"
      >
        <div className="flex items-center gap-4">
          <div className="max-w-[58rem] flex-1 space-y-1">
            <h2 className="font-heading text-3xl font-bold leading-[1.1] md:text-4xl">
              Featured products
            </h2>
            <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Explore products from around the world
            </Balancer>
          </div>
          <Link
            href="/products"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "hidden sm:flex",
              })
            )}
          >
            View all products
            <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            <span className="sr-only">View all products</span>
          </Link>
        </div>
        <div className="space-y-8">
          <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <React.Suspense
              fallback={Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            >
              {someProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </React.Suspense>
          </div>
          <Link
            href="/products"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "mx-auto flex w-fit sm:hidden",
              })
            )}
          >
            View all products
            <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            <span className="sr-only">View all products</span>
          </Link>
        </div>
      </section>
      <section
        id="featured-stores"
        aria-labelledby="featured-stores-heading"
        className="space-y-6 py-8 md:py-10 lg:py-12"
      >
        <div className="flex items-center gap-4">
          <div className="max-w-[58rem] flex-1 space-y-1">
            <h2 className="font-heading text-3xl font-bold leading-[1.1] md:text-4xl">
              Featured stores
            </h2>
            <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Explore stores from around the world
            </Balancer>
          </div>
          <Link
            href="/stores"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "hidden sm:flex",
              })
            )}
          >
            View all stores
            <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            <span className="sr-only">View all stores</span>
          </Link>
        </div>
        <div className="space-y-8">
          <div className="grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <React.Suspense
              fallback={Array.from({ length: 4 }).map((_, i) => (
                <StoreCardSkeleton key={i} />
              ))}
            >
              {someStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  href={`/products?store_ids=${store.id}`}
                />
              ))}
            </React.Suspense>
          </div>
          <Link
            href="/stores"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "mx-auto flex w-fit sm:hidden",
              })
            )}
          >
            View all stores
            <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            <span className="sr-only">View all stores</span>
          </Link>
        </div>
      </section>
    </Shell>
  )
}
