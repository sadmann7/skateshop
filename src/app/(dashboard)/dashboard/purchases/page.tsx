import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { orders, stores, type Order } from "@/db/schema"
import { env } from "@/env.mjs"
import { currentUser } from "@clerk/nextjs"
import { and, asc, desc, eq, inArray, like, sql } from "drizzle-orm"

import { getUserEmail } from "@/lib/utils"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { PurchasesTableShell } from "@/components/shells/purchases-table-shell"
import { Shell } from "@/components/shells/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Purchases",
  description: "Manage your purchases",
}

interface PurchasesPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function PurchasesPage({
  searchParams,
}: PurchasesPageProps) {
  const { page, per_page, sort, store, status } = searchParams ?? {}

  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const email = getUserEmail(user)

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

    const total = await tx
      .select({
        count: sql<number>`count(${orders.id})`,
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
      items,
      total,
    }
  })

  const pageCount = Math.ceil(total / limit)

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-purchases-header"
        aria-labelledby="dashboard-purchases-header-heading"
      >
        <PageHeaderHeading size="sm">Purchases</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your purchases
        </PageHeaderDescription>
      </PageHeader>
      <PurchasesTableShell data={items} pageCount={pageCount} />
    </Shell>
  )
}
