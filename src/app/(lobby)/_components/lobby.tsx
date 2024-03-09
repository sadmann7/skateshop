import Link from "next/link"

import { siteConfig } from "@/config/site"
import { type getGithubStars } from "@/lib/actions/github"
import type { getCategories, getFeaturedProducts } from "@/lib/actions/product"
import { type getFeaturedStores } from "@/lib/actions/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/cards/product-card"
import { StoreCard } from "@/components/cards/store-card"
import { ContentSection } from "@/components/content-section"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"

import { CategoryCard } from "./category-card"

interface LobbyProps {
  githubStarsPromise: ReturnType<typeof getGithubStars>
  productsPromise: ReturnType<typeof getFeaturedProducts>
  categoriesPromise: ReturnType<typeof getCategories>
  storesPromise: ReturnType<typeof getFeaturedStores>
}

export async function Lobby({
  githubStarsPromise,
  productsPromise,
  categoriesPromise,
  storesPromise,
}: LobbyProps) {
  // See the "Parallel data fetching" docs: https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
  const [githubStars, products, categories, stores] = await Promise.all([
    githubStarsPromise,
    productsPromise,
    categoriesPromise,
    storesPromise,
  ])

  return (
    <Shell className="max-w-6xl">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-24 text-center md:py-32">
        <div
          className="flex animate-fade-up flex-col space-y-2"
          style={{ animationDelay: "0.10s", animationFillMode: "both" }}
        >
          <Link href={siteConfig.links.x} target="_blank" rel="noreferrer">
            <Badge
              aria-hidden="true"
              className="rounded-full px-3.5 py-1.5"
              variant="secondary"
            >
              Rewritting with Next.js 14, follow along on X for updates
            </Badge>
            <span className="sr-only">X</span>
          </Link>
          <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
            <Badge
              aria-hidden="true"
              className="rounded-full px-3.5 py-1.5"
              variant="secondary"
            >
              <Icons.gitHub className="mr-2 size-3.5" aria-hidden="true" />
              {githubStars} stars on GitHub
            </Badge>
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
        <h1
          className="animate-fade-up text-balance font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.20s", animationFillMode: "both" }}
        >
          An e-commerce skateshop built with everything new in Next.js
        </h1>
        <p
          className="max-w-[42rem] animate-fade-up text-balance leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.30s", animationFillMode: "both" }}
        >
          Buy and sell skateboarding gears from independent brands and stores
          around the world with ease
        </p>
        <div
          className="flex animate-fade-up flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.40s", animationFillMode: "both" }}
        >
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
      <section
        className="grid animate-fade-up grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-4"
        style={{ animationDelay: "0.50s", animationFillMode: "both" }}
      >
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </section>
      <ContentSection
        title="Featured products"
        description="Explore products from around the world"
        href="/products"
        linkText="View all products"
        className="pt-8 md:pt-10 lg:pt-12"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ContentSection>
      <ContentSection
        title="Featured stores"
        description="Explore stores from around the world"
        href="/stores"
        linkText="View all stores"
        className="py-8 md:py-10 lg:py-12"
      >
        {stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            href={`/products?store_ids=${store.id}`}
          />
        ))}
      </ContentSection>
    </Shell>
  )
}
