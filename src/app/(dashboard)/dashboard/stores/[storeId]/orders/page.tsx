import { env } from "@/env.mjs"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores, orders, products, type Product, type Order } from "@/db/schema"
import { and, asc, desc, eq, sql, inArray } from "drizzle-orm"

import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Orders",
  description: "Manage your orders",
}

interface OrdersPageProps {
  params: {
    storeId: string
  },
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function OrdersPage({ params, searchParams }: OrdersPageProps) {
  const storeId = Number(params.storeId)

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
      description: true,
    },
  })

  if (!store) {
    notFound()
  }

  const { page, per_page, sort, item } = searchParams

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
        keyof Order | undefined,
        "asc" | "desc" | undefined
      ])
      : []

  const items =
    typeof item === "string"
      ? item.split(".").map(Number).filter(Number)
      : []

  // Transaction is used to ensure both queries are executed in a single transaction
  const { userOrders, totalOrders, userProducts } = await db.transaction(async (tx) => {
    const userOrders = await tx
      .select()
      .from(orders)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(orders.storeId, storeId),
          // Filter by items
          items.length > 0
            ? inArray(products.id, items)
            : undefined,
        )
      )
      .orderBy(
        column && column in orders
          ? order === "asc"
            ? asc(orders[column])
            : desc(orders[column])
          : desc(orders.createdAt)
      )

    const totalOrders = await tx
      .select({
        count: sql<number>`count(${orders.id})`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.storeId, storeId),
          // Filter by items
          items.length > 0
            ? inArray(products.id, items)
            : undefined,
        )
      )

    const productIds = userOrders.flatMap(order => order.items?.map(item => item.productId) ?? [])

    let userProducts: Product[] = [];

    if (productIds.length > 0) {
      userProducts = await tx
        .select()
        .from(products)
        .where(inArray(products.id, productIds));
    }

    return {
      userOrders,
      totalOrders: Number(totalOrders[0]?.count) ?? 0,
      userProducts,
    }
  })

  const pageCount = Math.ceil(totalOrders / limit)

  return (
    <>
      {/* {env.NODE_ENV !== "production" && <GenerateButton storeId={storeId} />} */}

      <OrdersTableShell
        orders={userOrders}
        products={userProducts}
        pageCount={pageCount}
      />
    </>
  )
}