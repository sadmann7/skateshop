import Link from "next/link"
import { db } from "@/db"
import { products, stores, type Product } from "@/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { Balancer } from "react-wrap-balancer"

import { productCategories } from "@/config/products"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs } from "@/components/ui/tabs"
import { CategoryCard } from "@/components/cards/category-card"
import { ProductCard } from "@/components/cards/product-card"
import { StoreCard } from "@/components/cards/store-card"
import { Icons } from "@/components/icons"
import { ProudctTabs } from "@/components/pagers/product-tabs"
import { Shell } from "@/components/shells/shell"

interface IndexPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function IndexPage({ searchParams }: IndexPageProps) {
  const category = searchParams?.category ?? "skateboards"

  const someProducts = await db
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
    .limit(4)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(
      typeof category === "string"
        ? eq(products.category, category as Product["category"])
        : undefined
    )
    .groupBy(products.id)
    .orderBy(desc(stores.stripeAccountId), desc(products.createdAt))

  const someStores = await db
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
    .orderBy(desc(stores.stripeAccountId), desc(sql<number>`count(*)`))

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
    <Shell className="pt-0 md:pt-0">
      <section
        id="hero"
        aria-labelledby="hero-heading"
        className="mx-auto flex w-full max-w-[64rem] flex-col items-center justify-center gap-4 py-12 text-center md:pt-32"
      >
        {githubStars ? (
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <Badge
              aria-hidden="true"
              className="rounded-md px-3.5 py-1.5"
              variant="secondary"
            >
              <Icons.gitHub className="mr-2 h-3.5 w-3.5" />
              {githubStars} stars on GitHub
            </Badge>
            <span className="sr-only">GitHub</span>
          </Link>
        ) : null}
        <Balancer
          as="h1"
          className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
        >
          An e-commerce skateshop built with everything new in Next.js 13
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
        className="space-y-6 py-8 md:pt-10 lg:pt-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Categories
          </h2>
          <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Find the best skateboarding gears from stores around the world
          </Balancer>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productCategories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </section>
      <section
        id="featured-products"
        aria-labelledby="featured-products-heading"
        className="space-y-6 overflow-hidden py-8 md:pt-12 lg:pt-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 overflow-visible text-center">
          <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Featured products
          </h2>
          <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Explore products from around the world
          </Balancer>
        </div>
        <Tabs defaultValue="skateboards" className="space-y-6 overflow-visible">
          <ScrollArea
            orientation="horizontal"
            className="pb-2"
            scrollBarClassName="h-1.5"
          >
            <ProudctTabs />
          </ScrollArea>

          <div className="flex flex-col space-y-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {someProducts.length > 0 ? (
                someProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-1 pt-10">
                  <Icons.product
                    className="mb-4 h-16 w-16 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div className="text-xl font-medium text-muted-foreground">
                    No products found
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Please try again later
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/stores"
              className={cn(
                buttonVariants({
                  className: "mx-auto",
                })
              )}
            >
              View all products
              <span className="sr-only">View all stores</span>
            </Link>
          </div>
        </Tabs>
      </section>
      <section
        id="featured-stores"
        aria-labelledby="featured-stores-heading"
        className="flex flex-col space-y-6 py-8 md:pt-12 lg:pt-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            Featured stores
          </h2>
          <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Explore stores from around the world
          </Balancer>
        </div>
        <div className="flex flex-col space-y-10">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {someStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                href={`/products?store_ids=${store.id}`}
              />
            ))}
          </div>
          <Link
            href="/stores"
            className={cn(
              buttonVariants({
                className: "mx-auto",
              })
            )}
          >
            View all stores
            <span className="sr-only">View all stores</span>
          </Link>
        </div>
      </section>
      <section
        id="random-subcategories"
        aria-labelledby="random-subcategories-heading"
        className="flex flex-wrap items-center justify-center gap-4 py-6"
      >
        {productCategories[
          Math.floor(Math.random() * productCategories.length)
        ]?.subcategories.map((subcategory) => (
          <Link
            key={subcategory.slug}
            href={`/categories/${String(productCategories[0]?.title)}/${
              subcategory.slug
            }`}
          >
            <Badge variant="secondary" className="rounded px-3 py-1">
              {subcategory.title}
            </Badge>
            <span className="sr-only">{subcategory.title}</span>
          </Link>
        ))}
      </section>
    </Shell>
  )
}
