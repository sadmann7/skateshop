import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq, sql } from "drizzle-orm"

import { formatNumber } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Analytics",
  description: "Analytics for your store",
}

interface AnalyticsPageProps {
  params: {
    storeId: string
  }
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
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

  const storeOrders = await db
    .select({
      amount: orders.amount,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.storeId, store.id))

  const sales = storeOrders.reduce(
    (acc, order) => acc + Number(order.amount),
    0
  )

  const customers = await db
    .select({
      name: orders.name,
      email: orders.email,
      totalSpent: sql<string>`SUM(${orders.amount})`,
      createdAt: sql<string>`MIN(${orders.createdAt})`,
    })
    .from(orders)
    .where(eq(orders.storeId, store.id))
    .groupBy(orders.email, orders.name)

  return (
    <div className="grid w-full gap-10 p-1">
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {customers.map((customer) => (
              <div key={customer.email} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>
                    {customer.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.email}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  +${formatNumber(customer.totalSpent)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
