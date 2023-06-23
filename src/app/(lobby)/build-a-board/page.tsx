import { type Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { productCategories } from "@/config/products"
import { cn } from "@/lib/utils"
import { Card, CardTitle } from "@/components/ui/card"
import { BoardBuilder } from "@/components/board-builder"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"
import { addToCartAction } from "@/app/_actions/cart"
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

  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0
  const activeSubcategory = typeof subcategory === "string" ? subcategory : null

  const productsTransaction = await getProductsAction({
    limit,
    offset,
    sort: typeof sort === "string" ? sort : null,
    subcategories: activeSubcategory,
    price_range: typeof price_range === "string" ? price_range : null,
  })

  const pageCount = Math.ceil(productsTransaction.total / limit)

  // await addToCartAction({
  //   productId: 451,
  //   quantity: 1,
  // })

  return (
    <Shell className="gap-0">
      <Header
        title="Build a Board"
        description="Select the components for your board"
        size="sm"
      />
      <div className="sticky top-14 z-30 w-full shrink-0 overflow-hidden bg-background pb-7 pt-8">
        <div className="flex w-full items-center justify-between gap-4 overflow-x-auto pb-1">
          {productCategories[0]?.subcategories.map((subcategory) => (
            <Link
              aria-label={`Go to ${subcategory.title}`}
              key={subcategory.title}
              href={`/build-a-board?subcategory=${subcategory.slug}`}
            >
              <Card
                className={cn(
                  "grid h-24 w-44 place-items-center gap-2 p-6 hover:bg-muted",
                  subcategory.slug === activeSubcategory && "bg-muted"
                )}
              >
                {subcategory.slug === searchParams?.[subcategory.slug] ? (
                  <Icons.check className="h-4 w-4" />
                ) : (
                  <Icons.circle className="h-4 w-4" />
                )}
                <CardTitle>{subcategory.title}</CardTitle>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <BoardBuilder
        products={productsTransaction.items}
        pageCount={pageCount}
      />
    </Shell>
  )
}
