import * as React from "react"
import { type Metadata } from "next"
import { unstable_noStore as noStore } from "next/cache"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { categories, products, stores, type Product } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { and, asc, desc, eq, gte, inArray, like, lte, sql } from "drizzle-orm"

import { storesProductsSearchParamsSchema } from "@/lib/validations/params"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
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
  searchParams: SearchParams
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const storeId = decodeURIComponent(params.storeId)

  // Parse search params using zod schema
  const { page, per_page, sort, name, category, from, to } =
    storesProductsSearchParamsSchema.parse(searchParams)

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

  // Fallback page for invalid page numbers
  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  // Number of items per page
  const limit = isNaN(per_page) ? 10 : per_page
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
  // Column and order to sort by
  const [column, order] = (sort?.split(".") as [
    keyof Product | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  const categoryIds = category?.split(".") ?? []

  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined

  // Transaction is used to ensure both queries are executed in a single transaction
  const productsPromise = db.transaction(async (tx) => {
    noStore()
    try {
      const data = await tx
        .select({
          id: products.id,
          name: products.name,
          category: categories.name,
          price: products.price,
          inventory: products.inventory,
          rating: products.rating,
          createdAt: products.createdAt,
        })
        .from(products)
        .limit(limit)
        .offset(offset)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            eq(products.storeId, storeId),
            // Filter by name
            name ? like(products.name, `%${name}%`) : undefined,
            // Filter by category
            categoryIds.length > 0
              ? inArray(products.categoryId, categoryIds)
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(products.createdAt, fromDay),
                  lte(products.createdAt, toDay)
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

      const count = await tx
        .select({
          count: sql<number>`count(${products.id})`,
        })
        .from(products)
        .where(
          and(
            eq(products.storeId, storeId),
            // Filter by name
            name ? like(products.name, `%${name}%`) : undefined,
            // Filter by category
            categoryIds.length > 0
              ? inArray(products.categoryId, categoryIds)
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(products.createdAt, fromDay),
                  lte(products.createdAt, toDay)
                )
              : undefined
          )
        )
        .then((res) => res[0]?.count ?? 0)

      const pageCount = Math.ceil(count / limit)

      return {
        data,
        pageCount,
      }
    } catch (err) {
      console.error(err)
      return {
        data: [],
        pageCount: 0,
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <DateRangePicker align="end" />
      </div>
      <React.Suspense
        fallback={
          <DataTableSkeleton
            columnCount={6}
            isNewRowCreatable={true}
            isRowsDeletable={true}
          />
        }
      >
        <ProductsTableShell promise={productsPromise} storeId={storeId} />
      </React.Suspense>
    </div>
  )
}
