import { type Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import { db } from "@/db"
import { carts, products, stores } from "@/db/schema"
import { eq } from "drizzle-orm"

import { productCategories } from "@/config/products"
import { cn } from "@/lib/utils"
import { BoardBuilder } from "@/components/board-builder"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"
import { getCartItemsAction } from "@/app/_actions/cart"
import { getProductsAction } from "@/app/_actions/product"
import { desc } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Build a Board",
  description: "Select the components for your board",
}

interface BuildABoadPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ProductCard } from "@/components/product-card"

export default async function BuildABoardPage({
  searchParams,
}: BuildABoadPageProps) {
  const { page, per_page, sort, subcategory, price_range } = searchParams

  // Products transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0
  const activeSubcategory =
    typeof subcategory === "string" ? subcategory : "decks"

  const productsTransaction = await getProductsAction({
    limit,
    offset,
    sort: typeof sort === "string" ? sort : null,
    subcategories: activeSubcategory,
    price_range: typeof price_range === "string" ? price_range : null,
  })

  const pageCount = Math.ceil(productsTransaction.total / limit)

  // Get cart items
  const cartItems = await getCartItemsAction()

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
    <Shell className="gap-4">
      <Header
        title="Build a Board"
        description="Select the components for your board"
        size="sm"
      />
      <div className="sticky top-14 z-30 w-full shrink-0 overflow-hidden bg-background/80 pb-4 pt-6 shadow-md sm:backdrop-blur-md">
        <div className="grid place-items-center overflow-x-auto">
          <div className="inline-flex w-fit items-center rounded border bg-background p-1 text-muted-foreground shadow-2xl">
            {productCategories[0]?.subcategories.map((subcategory) => (
              <Link
                aria-label={subcategory.title}
                key={subcategory.title}
                href={`/build-a-board?subcategory=${subcategory.slug}`}
              >
                <div
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    subcategory.slug === activeSubcategory &&
                    "rounded-none border-primary text-foreground hover:rounded-t"
                  )}
                >
                  {cartItems
                    ?.map((item) => item.productSubcategory)
                    ?.includes(subcategory.slug) ? (
                    <Icons.check className="mr-2 h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Icons.circle className="mr-2 h-4 w-4" aria-hidden="true" />
                  )}
                  {subcategory.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {allProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
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
              // className={cn(
              //   // buttonVariants({
              //   //   size: "sm",
              //   //   className: "h-8 w-full",
              //   // })
              // )}
              >
                View products
                <span className="sr-only">{`${store.name} store products`}</span>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
      <BoardBuilder
        products={productsTransaction.items}
        pageCount={pageCount}
        subcategory={activeSubcategory}
        cartItems={cartItems ?? []}
        app={allProducts}
      />
    </Shell>
  )
}
