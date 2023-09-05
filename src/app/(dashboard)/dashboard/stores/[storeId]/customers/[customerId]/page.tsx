import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, stores, type Order } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"

import { DateRangePicker } from "@/components/date-range-picker"
import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Customer's Orders",
  description: "View the customer's order details",
}

interface CustomerPageProps {
  params: {
    storeId: string
    customerId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function CustomerPage({
  params,
  searchParams,
}: CustomerPageProps) {
  const storeId = Number(params.storeId)
  // Using the customerId as the userId
  const userId = params.customerId

  const { page, per_page, sort, status, from, to } = searchParams ?? {}

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

  const fromDay = typeof from === "string" ? new Date(from) : undefined
  const toDay = typeof to === "string" ? new Date(to) : undefined

  // Transaction is used to ensure both queries are executed in a single transaction
  const { items, count } = await db.transaction(async (tx) => {
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
          eq(orders.userId, userId),
          // Filter by status
          statuses.length > 0
            ? inArray(orders.stripePaymentIntentStatus, statuses)
            : undefined,
          // Filter by createdAt
          fromDay && toDay
            ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
            : undefined
        )
      )
      .orderBy(
        column && column in orders
          ? order === "asc"
            ? asc(orders[column])
            : desc(orders[column])
          : desc(orders.createdAt)
      )

    const count = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.storeId, storeId),
          eq(orders.userId, userId),
          // Filter by status
          statuses.length > 0
            ? inArray(orders.stripePaymentIntentStatus, statuses)
            : undefined,
          // Filter by createdAt
          fromDay && toDay
            ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
            : undefined
        )
      )
      .execute()
      .then((res) => res[0]?.count ?? 0)

    return {
      items,
      count,
    }
  })

  const pageCount = Math.ceil(count / limit)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {`Customer's`} orders
        </h2>
        <DateRangePicker align="end" />
      </div>
      <OrdersTableShell
        data={items}
        pageCount={pageCount}
        storeId={storeId}
        isSearchable={false}
      />
    </div>
  )
}
