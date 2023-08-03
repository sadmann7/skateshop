import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores, type Product } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, asc, desc, eq, inArray, like, sql } from "drizzle-orm"

import { GenerateButton } from "@/components/generate-button"
import { ProductsTableShell } from "@/components/shells/products-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Products",
  description: "Manage your products",
}

interface ProductsPageProps {
  params: {
    storeId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const storeId = Number(params.storeId)

  const { page, per_page, sort, name, category } = searchParams

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  // Number of items per page
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10
  // Number of items to skip
  const offset =
    typeof page === "string"
      ? parseInt(page) > 0
        ? (parseInt(page) - 1) * limit
        : 0
      : 0
  // Column and order to sort by
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Product | undefined,
          "asc" | "desc" | undefined,
        ])
      : []

  const categories =
    typeof category === "string"
      ? (category.split(".") as Product["category"][])
      : []

  // Transaction is used to ensure both queries are executed in a single transaction
  const { storeProducts, totalProducts } = await db.transaction(async (tx) => {
    const storeProducts = await tx
      .select()
      .from(products)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(products.storeId, storeId),
          // Filter by name
          typeof name === "string"
            ? like(products.name, `%${name}%`)
            : undefined,
          // Filter by category
          categories.length > 0
            ? inArray(products.category, categories)
            : undefined
        )
      )
      .orderBy(
        column && column in products
          ? order === "asc"
            ? asc(products[column])
            : desc(products[column])
          : desc(products.createdAt)
      )

    const totalProducts = await tx
      .select({
        count: sql<number>`count(${products.id})`,
      })
      .from(products)
      .where(
        and(
          eq(products.storeId, storeId),
          typeof name === "string"
            ? like(products.name, `%${name}%`)
            : undefined,
          categories.length > 0
            ? inArray(products.category, categories)
            : undefined
        )
      )

    return {
      storeProducts,
      totalProducts: Number(totalProducts[0]?.count) ?? 0,
    }
  })

  const pageCount = Math.ceil(totalProducts / limit)

  return (
    <div className="space-y-2.5">
      {env.NODE_ENV !== "production" && <GenerateButton storeId={storeId} />}
      <ProductsTableShell
        data={storeProducts}
        pageCount={pageCount}
        storeId={storeId}
      />
    </div>
  )
}
