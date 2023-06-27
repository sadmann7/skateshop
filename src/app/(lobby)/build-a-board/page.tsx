import { type Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { productCategories } from "@/config/products"
import { cn } from "@/lib/utils"
import { BoardBuilder } from "@/components/board-builder"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"
import { getCartItemsAction } from "@/app/_actions/cart"
import { getProductsAction } from "@/app/_actions/product"

export const metadata: Metadata = {
  title: "Build a Board",
  description: "Select the components for your board",
}

interface BuildABoadPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

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
  const cartId = cookies().get("cartId")?.value

  const cartItems = await getCartItemsAction({ cartId: Number(cartId) })

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
      <BoardBuilder
        products={productsTransaction.items}
        pageCount={pageCount}
        subcategory={activeSubcategory}
        cartItems={cartItems ?? []}
      />
    </Shell>
  )
}
