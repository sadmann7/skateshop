import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores, type Product } from "@/db/schema"
import { and, asc, desc, eq, like, sql } from "drizzle-orm"

import { ProductsTable } from "@/components/products-table"
import { StoreTabs } from "@/components/store-tabs"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products.",
}

interface ProductsPageProps {
  params: {
    storeId: number
  }
  searchParams: {
    page?: string
    items?: string
    sort?: keyof Product
    order?: "asc" | "desc"
    name?: string
    date?: string
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { storeId } = params

  const { page, items, sort, order, name, date } = searchParams

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
  const limit = items ? parseInt(items) : 10
  // Number of skaters to skip
  const offset = page ? (parseInt(page) - 1) * limit : 0

  const { storeProducts, totalProducts } = await db.transaction(async (tx) => {
    const storeProducts = await tx
      .select()
      .from(products)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(products.storeId, storeId),
          name ? like(products.name, `%${name}%`) : undefined
        )
      )
      .orderBy(
        order ? desc(products[sort ?? "name"]) : asc(products[sort ?? "name"])
      )
    const totalProducts = await tx
      .select({ count: sql`count(*)` })
      .from(products)
      .where(eq(products.storeId, storeId))

    return {
      storeProducts,
      totalProducts: Number(totalProducts[0]?.count) ?? 0,
    }
  })

  const pageCount = Math.ceil(totalProducts / limit)

  return (
    <section className="grid items-center gap-6 pb-8 pt-6 md:py-8">
      <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
      <div className="space-y-4 overflow-hidden md:space-y-0">
        <StoreTabs
          className="block md:hidden"
          storeId={storeId}
          activeTab="products"
        />
        <ProductsTable
          data={storeProducts}
          pageCount={pageCount}
          storeId={storeId}
        />
      </div>
    </section>
  )
}
