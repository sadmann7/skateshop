import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores, type Product } from "@/db/schema"
import { and, asc, desc, eq, gte, like, lte, sql } from "drizzle-orm"

import { ProductsTable } from "@/components/products-table"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products.",
}

interface ProductsPageProps {
  params: {
    storeId: string
  }
  searchParams: {
    page?: string
    per_page?: string
    sort?: keyof Product
    order?: "asc" | "desc"
    name?: string
    start_date?: string
    end_date?: string
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const storeId = Number(params.storeId)

  const { page, per_page, sort, order, name, start_date, end_date } =
    searchParams

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

  // Number of skaters to show per page
  const limit = per_page ? parseInt(per_page) : 10
  // Number of skaters to skip
  const offset =
    page && per_page ? (parseInt(page) - 1) * parseInt(per_page) : 0

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
          name ? like(products.name, `%${name}%`) : undefined,
          // Filter by created date
          start_date && end_date
            ? and(
                gte(products.createdAt, start_date),
                lte(products.createdAt, end_date)
              )
            : undefined
        )
      )
      .orderBy(
        // Sort by column
        order === "desc"
          ? desc(products[sort ?? "createdAt"])
          : asc(products[sort ?? "createdAt"])
      )
    const totalProducts = await tx
      .select({
        count: sql<number>`count(${products.id})`,
      })
      .from(products)
      .where(eq(products.storeId, storeId))

    return {
      storeProducts,
      totalProducts: Number(totalProducts[0]?.count) ?? 0,
    }
  })

  const pageCount = Math.ceil(totalProducts / limit)

  return (
    <ProductsTable
      data={storeProducts}
      pageCount={pageCount}
      storeId={storeId}
    />
  )
}
