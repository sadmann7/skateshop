import * as React from "react"
import { type Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, stores, type Order } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { and, asc, desc, eq, gte, inArray, lte, sql } from "drizzle-orm"

import { customerSearchParamsSchema } from "@/lib/validations/params"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
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
  searchParams: SearchParams
}

export default async function CustomerPage({
  params,
  searchParams,
}: CustomerPageProps) {
  const storeId = decodeURIComponent(params.storeId)
  // Get email from the customer id
  const emailParts = params.customerId.split("-")
  const email = `${emailParts[0]}@${emailParts[2]}.com`

  const { page, per_page, sort, status, from, to } =
    customerSearchParamsSchema.parse(searchParams)

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
    keyof Order | undefined,
    "asc" | "desc" | undefined,
  ]) ?? ["createdAt", "desc"]

  const statuses = status ? status.split(".") : []
  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined

  // Transaction is used to ensure both queries are executed in a single transaction
  const ordersPromise = db.transaction(async (tx) => {
    try {
      const data = await tx
        .select({
          id: orders.id,
          storeId: orders.storeId,
          quantity: orders.quantity,
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
            eq(orders.email, email),
            // Filter by status
            statuses.length > 0
              ? inArray(orders.stripePaymentIntentStatus, statuses)
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(orders.createdAt, fromDay),
                  lte(orders.createdAt, toDay)
                )
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
            eq(orders.email, email),
            // Filter by status
            statuses.length > 0
              ? inArray(orders.stripePaymentIntentStatus, statuses)
              : undefined,
            // Filter by createdAt
            fromDay && toDay
              ? and(
                  gte(orders.createdAt, fromDay),
                  lte(orders.createdAt, toDay)
                )
              : undefined
          )
        )
        .execute()
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
        <h2 className="text-2xl font-bold tracking-tight">
          {`Customer's`} orders
        </h2>
        <DateRangePicker align="end" />
      </div>
      <React.Suspense
        fallback={
          <DataTableSkeleton columnCount={6} searchableFieldCount={0} />
        }
      >
        <OrdersTableShell
          promise={ordersPromise}
          storeId={storeId}
          isSearchable={false}
        />
      </React.Suspense>
    </div>
  )
}
