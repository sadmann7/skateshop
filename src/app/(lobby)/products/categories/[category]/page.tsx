import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import { and, asc, desc, eq, lt } from "drizzle-orm"

import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"

interface ProductCateogryPageProps {
  params: {
    category: Product["category"]
  }
  searchParams: {
    limit?: number
    cursor?: number
    sort?: keyof Product
    order?: "asc" | "desc"
    price?: number
    storeIds?: number[]
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateMetadata({ params }: ProductCateogryPageProps) {
  return {
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  }
}

export default async function ProductCateogryPage({
  params,
  searchParams,
}: ProductCateogryPageProps) {
  const { category } = params
  const { cursor, sort, order, price, storeIds } = searchParams

  if (!products.category.enumValues.includes(category)) {
    return notFound()
  }

  const limit = searchParams.limit ?? 10

  const allProducts = await db
    .select()
    .from(products)
    .limit(limit + 1) // +1 to use as next cursor
    .where(
      and(
        eq(products.category, category),
        cursor ? lt(products.id, cursor) : undefined
      )
    )
    .orderBy(
      searchParams.order === "desc"
        ? desc(products[sort ?? "createdAt"])
        : asc(products[sort ?? "createdAt"])
    )

  let nextCursor: typeof cursor | undefined = undefined
  if (allProducts.length > limit) {
    const nextItem = allProducts.pop()
    nextCursor = nextItem?.id
  }

  return (
    <Shell>
      <Header title={toTitleCase(category)} description={`Buy ${category}`} />
      <Products products={allProducts} nextCursor={nextCursor} />
    </Shell>
  )
}
