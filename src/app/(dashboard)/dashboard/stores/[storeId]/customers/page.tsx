import * as React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, stores } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { and, asc, desc, eq, gte, like, lte, sql } from "drizzle-orm"

import { customersSearchParamsSchema } from "@/lib/validations/params"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DateRangePicker } from "@/components/date-range-picker"
import { CustomersTableShell } from "@/components/shells/customers-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Customers",
  description: "Customers for your store",
}

interface CustomersPageProps {
  params: {
    storeId: string
  }
  searchParams: SearchParams
}

export default async function CustomersPage({
  params,
  searchParams,
}: CustomersPageProps) {
  const storeId = decodeURIComponent(params.storeId)

  const { page, per_page, sort, email, from, to } =
    customersSearchParamsSchema.parse(searchParams)

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

  // Transaction is used to ensure both queries are executed in a single transaction
  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  // Number of items per page
  const limit = isNaN(per_page) ? 10 : per_page
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined

  const ordersPromise = db.transaction(async (tx) => {
    const data = await db
      .select({
        name: orders.name,
        email: orders.email,
        orderPlaced: sql<number>`count(*)`,
        totalSpent: sql<number>`sum(${orders.amount})`,
        createdAt: sql<string>`min(${orders.createdAt})`,
      })
      .from(orders)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(orders.storeId, storeId),
          // Filter by email
          email ? like(orders.email, `%${email}%`) : undefined,
          // Filter by createdAt
          fromDay && toDay
            ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
            : undefined
        )
      )
      .groupBy(orders.email, orders.name)
      .orderBy(
        sort === "name.asc"
          ? asc(orders.name)
          : sort === "name.desc"
            ? desc(orders.name)
            : sort === "email.asc"
              ? asc(orders.email)
              : sort === "email.desc"
                ? desc(orders.email)
                : sort === "totalSpent.asc"
                  ? asc(sql<number>`sum(${orders.amount})`)
                  : sort === "totalSpent.desc"
                    ? desc(sql<number>`sum(${orders.amount})`)
                    : sort === "orderPlaced.asc"
                      ? asc(sql<number>`count(*)`)
                      : sort === "orderPlaced.desc"
                        ? desc(sql<number>`count(*)`)
                        : sort === "createdAt.asc"
                          ? asc(sql<string>`min(${orders.createdAt})`)
                          : sort === "createdAt.desc"
                            ? desc(sql<string>`min(${orders.createdAt})`)
                            : sql<string>`min(${orders.createdAt})`
      )

    const altCount = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(eq(orders.storeId, storeId))
      .execute()
      .then((res) => res[0]?.count ?? 0)

    const count = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(orders)
      .where(
        and(
          eq(orders.storeId, storeId),
          // Filter by email
          email ? like(orders.email, `%${email}%`) : undefined,
          // Filter by createdAt
          fromDay && toDay
            ? and(gte(orders.createdAt, fromDay), lte(orders.createdAt, toDay))
            : undefined
        )
      )
      .groupBy(orders.email, orders.name)
      .execute()
      .then((res) => res[0]?.count ?? 0)

    return {
      data,
      pageCount: Math.ceil((altCount - count) / limit),
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
        <DateRangePicker align="end" />
      </div>
      <React.Suspense
        fallback={
          <DataTableSkeleton columnCount={5} filterableFieldCount={0} />
        }
      >
        <CustomersTableShell promise={ordersPromise} storeId={store.id} />
      </React.Suspense>
    </div>
  )
}
