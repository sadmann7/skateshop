import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { orders, products, type Product, type Order } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { env } from "@/env.mjs"
import { and, asc, desc, eq, sql, inArray } from "drizzle-orm"

// import { GenerateButton } from "@/components/generate-button"
import { PurchasesTableShell } from "@/components/shells/purchases-table-shell"

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
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
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
          eq(orders.userId, user.id),
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
          eq(orders.userId, user.id),
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

      <PurchasesTableShell
        orders={userOrders}
        products={userProducts}
        pageCount={pageCount}
      />
    </>
  )
}