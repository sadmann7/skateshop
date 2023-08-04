import { env } from "@/env.mjs"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores, orders } from "@/db/schema"
import { and, desc, eq, gte, lte, sql } from "drizzle-orm"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { SalesOverview } from "@/components/sales-overview"
import { RecentSales } from "@/components/recent-sales"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Payments",
  description: "Manage your payments",
}

interface PaymentsPageProps {
  params: {
    storeId: string
  }
}

export default async function PaymentsPage({ params }: PaymentsPageProps) {
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

  // Transaction is used to ensure both queries are executed in a single transaction
  const {
    monthlySales,
    recentSales,
    kpis,
  } = await db.transaction(async (tx) => {
    const monthlySales = []
    const monthlyCustomersCount = []
    const monthlySalesCount = []

    for (let i = 0; i < 12; i++) {
      const date = subMonths(new Date(), i)
      const monthKey = format(date, "MMM")

      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)

      // Monthly sales
      const monthSales = await tx
        .select({ total: sql`SUM(${orders.total})` })
        .from(orders)
        .where(and(gte(orders.createdAt, monthStart), lte(orders.createdAt, monthEnd)))

      monthlySales.unshift({ name: monthKey, total: Number(monthSales[0]?.total ?? 0) })

      // Monthly unique customers
      const monthCustomers = await tx
        .select({ count: sql`COUNT(DISTINCT ${orders.userId})` })
        .from(orders)
        .where(and(gte(orders.createdAt, monthStart), lte(orders.createdAt, monthEnd)))

      monthlyCustomersCount.unshift({ name: monthKey, count: Number(monthCustomers[0]?.count ?? 0) })

      // Monthly sales count
      const monthSalesCount = await tx
        .select({ count: sql`COUNT(${orders.id})` })
        .from(orders)
        .where(and(gte(orders.createdAt, monthStart), lte(orders.createdAt, monthEnd)))

      monthlySalesCount.unshift({ name: monthKey, count: Number(monthSalesCount[0]?.count ?? 0) })
    }

    // Extracting current and previous month's data from arrays
    const currentMonthSales = monthlySales[0] || { total: 0 }
    const previousMonthSales = monthlySales[1] || { total: 0 }

    const currentMonthCustomers = monthlyCustomersCount[0] || { count: 0 }
    const previousMonthCustomers = monthlyCustomersCount[1] || { count: 0 }

    const currentMonthSalesCount = monthlySalesCount[0] || { count: 0 }
    const previousMonthSalesCount = monthlySalesCount[1] || { count: 0 }

    // get the 5 most recent sales
    const recentSales = await tx
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5)

    // KPIs
    const kpis = {
      totalRevenue: {
        value: currentMonthSales.total,
        marginalIncrease: previousMonthSales.total > 0 ? Number(((currentMonthSales.total / previousMonthSales.total - 1) * 100).toFixed(2)) : 0,
      },
      uniqueCustomers: {
        value: currentMonthCustomers.count,
        marginalIncrease: previousMonthCustomers.count > 0 ? Number(((currentMonthCustomers.count / previousMonthCustomers.count - 1) * 100).toFixed(2)) : 0,
      },
      totalSales: {
        value: currentMonthSalesCount.count,
        marginalIncrease: previousMonthSalesCount.count > 0 ? Number(((currentMonthSalesCount.count / previousMonthSalesCount.count - 1) * 100).toFixed(2)) : 0,
      },
    }

    return {
      monthlySales,
      recentSales,
      kpis,
    }
  })


  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.totalRevenue.value}</div>
            <p className="text-xs text-muted-foreground">
              +{kpis.totalRevenue.marginalIncrease}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.uniqueCustomers.value}</div>
            <p className="text-xs text-muted-foreground">
              +{kpis.uniqueCustomers.marginalIncrease}% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{kpis.totalSales.value}</div>
            <p className="text-xs text-muted-foreground">+{kpis.totalSales.marginalIncrease}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesOverview sales={monthlySales} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made monthly sales this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales sales={recentSales} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}