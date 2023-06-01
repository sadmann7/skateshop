import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores, type Product } from "@/db/schema"
import { and, asc, desc, eq, like, sql } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { ProductsTable } from "@/components/products-table"

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
    <section className="container grid w-full items-center space-y-10 pb-20 pt-6 md:py-10">
      <Header title={store.name} description="Manage your products." />
      <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row">
        <Link href={`/account/stores/${storeId}`} className="w-full sm:w-fit">
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "outline",
              }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.store className="mr-2 h-4 w-4" />
            Manage Store
            <span className="sr-only">Manage Store</span>
          </div>
        </Link>
        <Link
          href={`/account/stores/${storeId}/products`}
          className="w-full sm:w-fit"
        >
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "secondary",
              }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.product className="mr-2 h-4 w-4" />
            Manage Products
            <span className="sr-only">Manage Products</span>
          </div>
        </Link>
      </div>
      <ProductsTable
        data={storeProducts}
        pageCount={pageCount}
        storeId={storeId}
      />
    </section>
  )
}
