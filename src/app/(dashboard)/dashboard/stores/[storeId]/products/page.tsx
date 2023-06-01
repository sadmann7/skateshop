import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores, type Product } from "@/db/schema"
import { and, asc, desc, eq, like, sql } from "drizzle-orm"
import { Activity, CreditCard, DollarSign, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Icons } from "@/components/icons"
import { ProductsTable } from "@/components/products-table"

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products.",
}

interface ProductsPageProps {
  params: {
    storeId: number
  }
  searchParams: {
    page?: string
    items?: string
    sort?: keyof Product
    order?: "asc" | "desc"
    name?: string
    date?: string
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { storeId } = params

  const { page, items, sort, order, name, date } = searchParams

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

  // Number of skaters to show per page
  const limit = items ? parseInt(items) : 10
  // Number of skaters to skip
  const offset = page ? (parseInt(page) - 1) * limit : 0

  const { storeProducts, totalProducts } = await db.transaction(async (tx) => {
    const storeProducts = await tx
      .select()
      .from(products)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          eq(products.storeId, storeId),
          name ? like(products.name, `%${name}%`) : undefined
        )
      )
      .orderBy(
        order ? desc(products[sort ?? "name"]) : asc(products[sort ?? "name"])
      )
    const totalProducts = await tx
      .select({ count: sql`count(*)` })
      .from(products)
      .where(eq(products.storeId, storeId))

    return {
      storeProducts,
      totalProducts: Number(totalProducts[0]?.count) ?? 0,
    }
  })

  const pageCount = Math.ceil(totalProducts / limit)

  return (
    <section className="container grid w-full items-center space-y-5 pb-20 pt-6 md:py-10">
      <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <ProductsTable
            data={storeProducts}
            pageCount={pageCount}
            storeId={storeId}
          />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row">
        <Link href={`/dashboard/stores/${storeId}`} className="w-full sm:w-fit">
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "outline",
              }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.store className="mr-2 h-4 w-4" />
            Manage Store
            <span className="sr-only">Manage Store</span>
          </div>
        </Link>
        <Link
          href={`/dashboard/stores/${storeId}/products`}
          className="w-full sm:w-fit"
        >
          <div
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "secondary",
              }),
              "w-full sm:w-auto"
            )}
          >
            <Icons.product className="mr-2 h-4 w-4" />
            Manage Products
            <span className="sr-only">Manage Products</span>
          </div>
        </Link>
      </div>
    </section>
  )
}
