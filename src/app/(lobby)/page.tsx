import Image from "next/image"
import Link from "next/link"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { desc } from "drizzle-orm"

import { productCategories } from "@/config/products"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductCard } from "@/components/product-card"
import { Shell } from "@/components/shell"

export const runtime = "edge"

export default async function IndexPage() {
  const allProducts = await db
    .select()
    .from(products)
    .limit(8)
    .orderBy(desc(products.createdAt))

  const allStores = await db
    .select()
    .from(stores)
    .limit(4)
    .orderBy(desc(stores.createdAt))

  return (
    <div>
      <Hero />
      <Shell>
        <Header
          className="place-items-center text-center"
          title="Buy rad skating goodies"
          description="We have a wide range of products to suit your needs"
        />
        <div className="space-y-5">
          <h2 className="text-2xl font-medium">Categories</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Object.values(products.category.enumValues).map((category) => (
              <Link
                aria-label={`Go to ${category}`}
                key={category}
                href={`/categories/${category}`}
              >
                <div className="group relative overflow-hidden rounded">
                  <AspectRatio ratio={4 / 5}>
                    <div className="absolute inset-0 z-10 bg-black/60 transition-colors group-hover:bg-black/70" />
                    <Image
                      src={`https://source.unsplash.com/featured/?${category}`}
                      alt={category}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <h3 className="text-2xl font-medium capitalize text-slate-100">
                      {category}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <Card className="mt-4 grid place-items-center gap-5 px-6 py-20 text-center">
          <h2 className="text-2xl font-medium">
            Do you want to sell your products on our website?
          </h2>
          <Link href="/dashboard/stores">
            <div
              className={cn(
                buttonVariants({
                  size: "sm",
                })
              )}
            >
              Create a store
            </div>
            <span className="sr-only">Create a store</span>
          </Link>
        </Card>
        <div className="space-y-5">
          <div className="flex items-center">
            <h2 className="flex-1 text-2xl font-medium">Featured products</h2>
            <Link href="/products">
              <div
                className={cn(
                  buttonVariants({
                    size: "sm",
                  })
                )}
              >
                View all
                <span className="sr-only">View all products</span>
              </div>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <h2 className="text-2xl font-medium">Featured stores</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {allStores.map((store) => (
              <Card key={store.id} className="flex h-full flex-col">
                <CardHeader className="flex-1">
                  <CardTitle className="line-clamp-1">{store.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {store.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/products?store_ids=${store.id}`}>
                    <div
                      className={cn(
                        buttonVariants({
                          size: "sm",
                          className: "h-8 w-full",
                        })
                      )}
                    >
                      View products
                      <span className="sr-only">{`${store.name} store products`}</span>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Card className="mt-4 grid place-items-center gap-5 px-6 py-20 text-center">
          <h2 className="text-2xl font-medium">
            Join our newsletter to get the latest news and updates
          </h2>
          <a
            href="/https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              className={cn(
                buttonVariants({
                  size: "sm",
                })
              )}
            >
              Join our newsletter
            </div>
            <span className="sr-only">
              Join our newsletter to get the latest news and updates
            </span>
          </a>
        </Card>
        <div className="flex flex-wrap items-center justify-center gap-4">
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
        </div>
      </Shell>
    </div>
  )
}
