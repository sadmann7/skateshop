import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, asc, desc, eq, like, sql } from "drizzle-orm"

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
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function CustomersPage({
  params,
  searchParams,
}: CustomersPageProps) {
  const storeId = Number(params.storeId)

  const { page, per_page, sort, email } = searchParams ?? {}

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

  // Number of items per page
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10
  // Number of items to skip
  const offset =
    typeof page === "string"
      ? parseInt(page) > 0
        ? (parseInt(page) - 1) * limit
        : 0
      : 0

  const { items, count } = await db.transaction(async (tx) => {
    const items = await db
      .select({
        email: orders.email,
        name: orders.name,
        userId: orders.userId,
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
          typeof email === "string"
            ? like(orders.email, `%${email}%`)
            : undefined
        )
      )
      .groupBy(orders.email, orders.name, orders.userId)
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
          typeof email === "string"
            ? like(orders.email, `%${email}%`)
            : undefined
        )
      )
      .groupBy(orders.email, orders.name)
      .execute()
      .then((res) => res[0]?.count ?? 0)

    return {
      items,
      count: altCount - count,
    }
  })

  const pageCount = Math.ceil(count / limit)

  return (
    <CustomersTableShell
      data={items}
      pageCount={pageCount}
      storeId={store.id}
    />
  )
}
