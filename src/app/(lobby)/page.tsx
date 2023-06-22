import Image from "next/image"
import Link from "next/link"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { desc, sql } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
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
    .select({
      id: stores.id,
      name: stores.name,
      description: stores.description,
    })
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
        <div className="space-y-4">
          <h2 className="text-2xl font-medium">Categories</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Object.values(products.category.enumValues).map((category) => (
              <Link
                aria-label={`Go to ${category}`}
                key={category}
                href={`/categories/${category}`}
              >
                <div className="group relative overflow-hidden">
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
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border px-4 py-16 text-center">
          <h2 className="text-xl font-medium">
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
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-medium">Featured products</h2>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Link href="/products">
              <div
                className={cn(
                  buttonVariants({
                    size: "sm",
                  })
                )}
              >
                View all products
                <span className="sr-only">View all products</span>
              </div>
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-medium">Featured stores</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {allStores.map((store) => (
              <Link
                aria-label={`${store.name} store products`}
                key={store.id}
                href={`/products?store_ids=${store.id}`}
              >
                <Card key={store.id} className="hover:bg-muted">
                  <CardHeader>
                    <CardTitle>{store.name}</CardTitle>
                    <CardDescription>{store.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Shell>
    </div>
  )
}
