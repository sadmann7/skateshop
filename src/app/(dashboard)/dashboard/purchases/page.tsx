import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { orders, stores, type Order } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { and, asc, desc, eq, inArray, like, sql } from "drizzle-orm"

import { getCacheduser } from "@/lib/actions/user"
import { getUserEmail } from "@/lib/utils"
import { purchasesSearchParamsSchema } from "@/lib/validations/params"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"
import { PurchasesTableShell } from "@/components/shells/purchases-table-shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Purchases",
  description: "Manage your purchases",
}
interface PurchasesPageProps {
  searchParams: SearchParams
}

export default async function PurchasesPage({
  searchParams,
}: PurchasesPageProps) {
  const { page, per_page, sort, store, status } =
    purchasesSearchParamsSchema.parse(searchParams)

  const user = await getCacheduser()

  if (!user) {
    redirect("/signin")
  }

  const email = getUserEmail(user)

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

  // Transaction is used to ensure both queries are executed in a single transaction
  const ordersPromise = db.transaction(async (tx) => {
    try {
      const data = await tx
        .select({
          id: orders.id,
          email: orders.email,
          items: orders.items,
          amount: orders.amount,
          status: orders.stripePaymentIntentStatus,
          createdAt: orders.createdAt,
          storeId: orders.storeId,
          store: stores.name,
        })
        .from(orders)
        .leftJoin(stores, eq(orders.storeId, stores.id))
        .limit(limit)
        .offset(offset)
        .where(
          and(
            eq(orders.email, email),
            // Filter by store
            typeof store === "string"
              ? like(stores.name, `%${store}%`)
              : undefined,
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
        .leftJoin(stores, eq(orders.storeId, stores.id))
        .where(
          and(
            eq(orders.email, email),
            // Filter by store
            typeof store === "string"
              ? like(stores.name, `%${store}%`)
              : undefined,
            // Filter by status
            statuses.length > 0
              ? inArray(orders.stripePaymentIntentStatus, statuses)
              : undefined
          )
        )
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        pageCount: Math.ceil(count / limit),
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
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-purchases-header"
        aria-labelledby="dashboard-purchases-header-heading"
        separated
      >
        <PageHeaderHeading size="sm">Purchases</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your purchases
        </PageHeaderDescription>
      </PageHeader>
      <React.Suspense fallback={<DataTableSkeleton columnCount={6} />}>
        <PurchasesTableShell promise={ordersPromise} />
      </React.Suspense>
    </Shell>
  )
}
