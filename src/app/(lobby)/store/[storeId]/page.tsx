import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"

import { Separator } from "@/components/ui/separator"
import { Products } from "@/components/products"
import { Shell } from "@/components/shells/shell"
import { Breadcrumbs } from "@/components/pagers/breadcrumbs"
import { getProductsAction } from "@/app/_actions/product"
import { getStoresAction } from "@/app/_actions/store"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Store",
  description: "Store description",
}

interface StorePageProps {
  params: {
    storeId: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function StorePage({
  params,
  searchParams,
}: StorePageProps) {
  const storeId = Number(params.storeId)

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  })

  if (!store) {
    notFound()
  }

  const { page, per_page, store_page } = searchParams

  // Products transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

  const productsTransaction = await getProductsAction({
    limit: limit,
    offset: offset,
    store_ids: String(storeId),
  })

  const pageCount = Math.ceil(productsTransaction.total / limit)

  // Stores transaction
  const storesLimit = 25
  const storesOffset =
    typeof store_page === "string"
      ? (parseInt(store_page) - 1) * storesLimit
      : 0

  const storesTransaction = await getStoresAction({
    limit: storesLimit,
    offset: storesOffset,
    sort: "name.asc",
  })

  const storePageCount = Math.ceil(storesTransaction.total / storesLimit)

  return (
    <Shell>
      <Breadcrumbs
        segments={[
          {
            title: "Stores",
            href: "/stores",
          },
          {
            title: store.name,
            href: `/store/${store.id}`,
          },
        ]}
      />
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <div className="flex w-full flex-col gap-4">
          <div className="space-y-2">
            <h2 className="line-clamp-1 text-2xl font-bold">{store.name}</h2>
            <p className="text-base text-muted-foreground">
              {store.description}
            </p>
          </div>
          <Separator className="my-1.5" />
          <Products
            products={productsTransaction.items}
            pageCount={pageCount}
            categories={Object.values(products.category.enumValues)}
            stores={storesTransaction.items}
            storePageCount={storePageCount}
          />
        </div>
      </div>
    </Shell>
  )
}