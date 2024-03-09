import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { orders, products } from "@/db/schema"
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

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Order",
  description: "View your order details",
}

interface OrderPageProps {
  params: {
    storeId: string
    orderId: string
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const storeId = decodeURIComponent(params.storeId)
  const orderId = decodeURIComponent(params.orderId)

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(products.storeId, storeId)),
  })

  if (!order) {
    notFound()
  }

  const orderLineItems = await getOrderLineItems({
    items: String(order.items),
    storeId: order.storeId,
  })

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle as="h2" className="text-2xl">
          Order {formatId(order.id)}
        </CardTitle>
        <CardDescription>View your order details</CardDescription>
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
                  {formatPrice((Number(item.price) * item.quantity).toFixed(2))}
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
  )
}
