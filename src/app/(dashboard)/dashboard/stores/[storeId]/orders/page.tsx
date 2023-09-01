import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, stores, type Order } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, asc, desc, eq, inArray, like, sql } from "drizzle-orm"

import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Orders",
  description: "Manage your orders",
}

interface OrdersPageProps {
  params: {
    storeId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function OrdersPage({
  params,
  searchParams,
}: OrdersPageProps) {
  const storeId = Number(params.storeId)

  const { page, per_page, sort, customer, status } = searchParams ?? {}

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
          keyof Order | undefined,
          "asc" | "desc" | undefined,
        ])
      : []

  const statuses = typeof status === "string" ? status.split(".") : []

  // Transaction is used to ensure both queries are executed in a single transaction
  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx
      .select({
        id: orders.id,
        storeId: orders.storeId,
        items: orders.items,
        amount: orders.amount,
        paymentIntentId: orders.stripePaymentIntentId,
        status: orders.stripePaymentIntentStatus,
        customer: orders.email,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(orders.storeId, storeId),
          // Filter by email
          typeof customer === "string"
            ? like(orders.email, `%${customer}%`)
            : undefined,
          // Filter by status
          statuses.length > 0
            ? inArray(orders.stripePaymentIntentStatus, statuses)
            : undefined
        )
      )
      .groupBy(orders.id)
      .orderBy(
        column && column in orders
          ? order === "asc"
            ? asc(orders[column])
            : desc(orders[column])
          : desc(orders.createdAt)
      )

    const total = await tx
      .select({
        count: sql<number>`count(${orders.id})`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.storeId, storeId),
          // Filter by email
          typeof customer === "string"
            ? like(orders.email, `%${customer}%`)
            : undefined,
          // Filter by status
          statuses.length > 0
            ? inArray(orders.stripePaymentIntentStatus, statuses)
            : undefined
        )
      )
      .groupBy(orders.id)
      .then((res) => res[0]?.count ?? 0)

    return {
      items,
      total,
    }
  })

  const pageCount = Math.ceil(total / limit)

  return (
    <OrdersTableShell data={items} pageCount={pageCount} storeId={storeId} />
  )
}
