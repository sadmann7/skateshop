import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { format } from "date-fns"
import { eq } from "drizzle-orm"

import {
  getCustomers,
  getOrderCount,
  getSaleCount,
  getSales,
} from "@/lib/actions/order"
import { cn, formatNumber, formatPrice } from "@/lib/utils"
import { searchParamsSchema } from "@/lib/validations/params"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DateRangePicker } from "@/components/date-range-picker"

import { OverviewCard } from "./_components/overview-card"
import { SalesChart } from "./_components/sales-chart"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Analytics",
  description: "Analytics for your store",
}

interface AnalyticsPageProps {
  params: {
    storeId: string
  }
  searchParams: SearchParams
}

export default async function AnalyticsPage({
  params,
  searchParams,
}: AnalyticsPageProps) {
  const storeId = decodeURIComponent(params.storeId)

  const { page, from, to } = searchParamsSchema
    .omit({ per_page: true, sort: true })
    .parse(searchParams)

  const fromDay = from ? new Date(from) : undefined
  const toDay = to ? new Date(to) : undefined
  const dayCount =
    fromDay && toDay
      ? Math.round(
          (toDay.getTime() - fromDay.getTime()) / (1000 * 60 * 60 * 24)
        )
      : undefined

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

  const orderCountPromise = getOrderCount({
    storeId,
    fromDay: fromDay,
    toDay: toDay,
  })

  const saleCountPromise = getSaleCount({
    storeId,
    fromDay: fromDay,
    toDay: toDay,
  })

  const salesPromise = getSales({
    storeId,
    fromDay: fromDay,
    toDay: toDay,
  })

  const customersPromise = getCustomers({
    storeId,
    limit: 5,
    offset: (page - 1) * 5,
    fromDay: fromDay,
    toDay: toDay,
  })

  const [saleCount, orderCount, sales, { customers, customerCount }] =
    await Promise.all([
      saleCountPromise,
      orderCountPromise,
      salesPromise,
      customersPromise,
    ])

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
        <DateRangePicker align="end" dayCount={30} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Total Revenue"
          value={formatPrice(saleCount, {
            notation: "standard",
          })}
          description="Total revenue for your store"
          icon="dollarSign"
        />
        <OverviewCard
          title="Sales"
          value={formatPrice(saleCount, {
            notation: "standard",
          })}
          description="Total sales for your store"
          icon="credit"
        />
        <OverviewCard
          title="Orders"
          value={formatNumber(orderCount)}
          description="Total orders for your store"
          icon="cart"
        />
        <OverviewCard
          title="Customers"
          value={formatNumber(customerCount)}
          description="Total customers for your store"
          icon="activity"
        />
      </div>
      <div className="flex flex-col gap-4 2xl:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Sales</CardTitle>
            <CardDescription>
              Total sales in the last {dayCount} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesChart
              data={sales.map((sale) => ({
                name: format(new Date(sale.year, sale.month - 1), "MMM"),
                Total: sale.totalSales,
              }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>
              Customers who have purchased in the last {dayCount} days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {customers.map((customer) => (
              <div
                key={customer.email}
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                  <Avatar className="size-9">
                    <AvatarFallback>
                      {customer.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full space-y-1 text-sm">
                    <p className="font-medium leading-none">{customer.name}</p>
                    <p className="break-all leading-none text-muted-foreground">
                      {customer.email}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium leading-none">
                  {formatPrice(customer.totalSpent)}
                </p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={`?page=${page - 1}&from=${from}&to=${to}`}
                    scroll={false}
                    className={cn(
                      "transition-opacity",
                      page === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href={`?page=${page + 1}&from=${from}&to=${to}`}
                    scroll={false}
                    className={cn(
                      "transition-opacity",
                      Math.ceil(customerCount / 5) === page &&
                        "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
