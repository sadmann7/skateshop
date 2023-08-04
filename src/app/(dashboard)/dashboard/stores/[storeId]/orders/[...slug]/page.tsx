import { db } from "@/db"
import { stores, orders, products, type Order, type Product } from "@/db/schema"
import { env } from "@/env.mjs"
import { and, eq, inArray } from "drizzle-orm"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductCard } from "@/components/product-card"

import {
  Card,
} from "@/components/ui/card"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Purchase",
  description: "View your purchase",
}

interface PurchasePageProps {
  params: {
    storeId: string
    purchaseId: string
  }
}

export default async function PurchasePage({
  params,
}: PurchasePageProps) {

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

  const purchaseId = Number(params.purchaseId)

  // Transaction is used to ensure both queries are executed in a single transaction
  const { purchase, purchasedProducts }: { purchase: Order | undefined, purchasedProducts: Product[] | undefined } = await db.transaction(async (tx) => {
    const purchase = await db.query.orders.findFirst({
      where: and(eq(orders.id, purchaseId), eq(orders.storeId, storeId)),
    })

    const productIds = purchase?.items?.map(item => item.productId) ?? [];

    let purchasedProducts: Product[] = [];

    if (productIds.length > 0) {
      purchasedProducts = await tx
        .select()
        .from(products)
        .where(inArray(products.id, productIds));
    }

    return { purchase, purchasedProducts }
  })

  if (!purchase || !purchasedProducts) {
    notFound()
  }

  return (
    <>
      <section
        id="purchase-info"
        aria-labelledby="purchase-info-heading"
        className="space-y-5"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">Purchase info</h2>
        <Card className="grid gap-4 p-6">
          <h3 className="text-lg font-semibold sm:text-xl">
            {purchase.id}
          </h3>
          <p className="text-lg text-muted-foreground">
            Total:{" "}{purchase.total}
          </p>
        </Card>
      </section>
      <section
        id="products"
        aria-labelledby="products-heading"
        className="space-y-5 pb-2.5"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">
          Items
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {purchasedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  )
}
