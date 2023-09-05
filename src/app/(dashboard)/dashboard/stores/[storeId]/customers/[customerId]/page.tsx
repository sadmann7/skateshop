import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, stores, type Order } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { OrdersTableShell } from "@/components/shells/orders-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Orders",
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

  const { page, per_page, sort, status } = searchParams ?? {}

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
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle as="h2" className="text-2xl">
          Customer orders
        </CardTitle>
        <CardDescription>View the {`customer's`} order details</CardDescription>
      </CardHeader>
      <CardContent>
        <OrdersTableShell
          data={items}
          pageCount={pageCount}
          storeId={storeId}
          isSearchable={false}
        />
      </CardContent>
    </Card>
  )
}
