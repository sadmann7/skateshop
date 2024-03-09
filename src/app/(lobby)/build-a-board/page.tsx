import { type Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import { env } from "@/env.js"
import { CheckIcon, CircleIcon } from "@radix-ui/react-icons"

import { productCategories } from "@/config/product"
import { getCartItems } from "@/lib/fetchers/cart"
import { getProducts } from "@/lib/fetchers/product"
import { cn } from "@/lib/utils"
import { productsSearchParamsSchema } from "@/lib/validations/params"
import { BoardBuilder } from "@/components/board-builder"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
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
  const { page, per_page, sort, subcategory, price_range, active } =
    productsSearchParamsSchema.parse(searchParams)

  // Products transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0
  const activeSubcategory =
    typeof subcategory === "string" ? subcategory : "decks"

  const { data, pageCount } = await getProducts({
    limit,
    offset,
    sort: typeof sort === "string" ? sort : null,
    subcategories: activeSubcategory,
    price_range: typeof price_range === "string" ? price_range : null,
    active,
  })

  // Get cart items
  const cartId = cookies().get("cartId")?.value
  const cartItems = await getCartItems({ cartId: Number(cartId) })

  return (
    <Shell className="gap-4">
      <PageHeader
        id="build-a-board-header"
        aria-labelledby="build-a-board-header-heading"
      >
        <PageHeaderHeading size="sm">Build a Board</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Select the components for your board
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="build-a-board-categories"
        aria-labelledby="build-a-board-categories-heading"
        className="sticky top-14 z-30 w-full shrink-0 overflow-hidden bg-background/50 pb-4 pt-6 shadow-md sm:backdrop-blur"
      >
        <div className="grid place-items-center overflow-x-auto">
          <div className="inline-flex w-fit items-center rounded border bg-background p-1 text-muted-foreground shadow-2xl">
            {productCategories[0]?.subcategories.map((subcategory) => (
              <Link
                aria-label={subcategory.title}
                key={subcategory.title}
                href={`/build-a-board?subcategory=${subcategory.slug}`}
                scroll={false}
              >
                <div
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded border-b-2 border-transparent px-3 py-1.5 text-sm font-medium ring-offset-background transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    subcategory.slug === activeSubcategory &&
                      "rounded-none border-primary text-foreground hover:rounded-t"
                  )}
                >
                  {cartItems
                    ?.map((item) => item.subcategory)
                    ?.includes(subcategory.slug) ? (
                    <CheckIcon className="mr-2 size-4" aria-hidden="true" />
                  ) : (
                    <CircleIcon className="mr-2 size-4" aria-hidden="true" />
                  )}
                  {subcategory.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <BoardBuilder
        products={data}
        pageCount={pageCount}
        subcategory={activeSubcategory}
        cartItems={cartItems ?? []}
      />
    </Shell>
  )
}
