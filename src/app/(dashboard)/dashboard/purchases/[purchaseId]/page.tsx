import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, stores } from "@/db/schema"
import { env } from "@/env.js"
import { and, eq } from "drizzle-orm"

import { getOrderLineItems } from "@/lib/actions/order"
import { formatId, formatPrice } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Purchase",
  description: "View your purchase details",
}

interface PurchasePageProps {
  params: {
    purchaseId: string
  }
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  // Using the purchaseId as the orderId in the sql query
  const orderId = decodeURIComponent(params.purchaseId)

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.id, orderId)),
  })

  if (!order) {
    notFound()
  }

  const orderLineItems = await getOrderLineItems({
    items: String(order.items),
    storeId: order.storeId,
  })

  const store = await db.query.stores.findFirst({
    columns: {
      name: true,
    },
    where: eq(stores.id, order.storeId),
  })

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="purchase-page-header"
        aria-labelledby="purchase-page-header-heading"
      >
        <PageHeaderHeading size="sm">Purchase</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          View your purchase details
        </PageHeaderDescription>
      </PageHeader>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle as="h2" className="text-2xl">
            Order {formatId(orderId)}
          </CardTitle>
          <CardDescription>{store?.name ?? "Unknown store"}</CardDescription>
        </CardHeader>
        <CardContent className="flex w-full flex-col space-y-2.5">
          {orderLineItems.map((item) => (
            <Link
              aria-label={`View ${item.name}`}
              key={item.id}
              href={`/product/${item.id}`}
              className="rounded-md bg-muted px-4 py-2.5 hover:bg-muted/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1 self-start">
                    <span className="line-clamp-1 text-sm font-medium">
                      {item.name}
                    </span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      Qty {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 font-medium">
                  <span className="ml-auto line-clamp-1 text-sm">
                    {formatPrice(
                      (Number(item.price) * item.quantity).toFixed(2)
                    )}
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {formatPrice(item.price)} each
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </Shell>
  )
}
