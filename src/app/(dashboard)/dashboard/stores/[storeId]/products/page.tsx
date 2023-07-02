import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores, type Product } from "@/db/schema"
import dayjs from "dayjs"
import { and, asc, desc, eq, gte, like, lte, sql } from "drizzle-orm"

import { ProductsTable } from "@/components/products-table"

export const metadata: Metadata = {
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

  const { page, per_page, sort, name, date_range } = searchParams

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
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10
  // Number of skaters to skip
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0
  // Column and order to sort by
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Product | undefined,
          "asc" | "desc" | undefined
        ])
      : []
  // Date range for created date
  const [start_date, end_date] =
    typeof date_range === "string"
      ? date_range.split("to").map((date) => dayjs(date).toDate())
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
          start_date && end_date
            ? and(
                gte(products.createdAt, start_date),
                lte(products.createdAt, end_date)
              )
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
    <ProductsTable
      data={storeProducts}
      pageCount={pageCount}
      storeId={storeId}
    />
  )
}
