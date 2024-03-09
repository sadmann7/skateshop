import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"
import { eq } from "drizzle-orm"

import { getProducts } from "@/lib/actions/product"
import { getStores } from "@/lib/actions/store"
import { Separator } from "@/components/ui/separator"
import { AlertCard } from "@/components/alert-card"
import { Breadcrumbs } from "@/components/pagers/breadcrumbs"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"

interface StorePageProps {
  params: {
    storeId: string
  }
  searchParams: SearchParams
}

async function getStoreFromParams(params: StorePageProps["params"]) {
  const storeId = decodeURIComponent(params.storeId)

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
  })

  if (!store) return null

  return store
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const store = await getStoreFromParams(params)

  if (!store) {
    return {}
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: store.name,
    description: store.description,
  }
}

export default async function StorePage({
  params,
  searchParams,
}: StorePageProps) {
  const store = await getStoreFromParams(params)

  if (!store) {
    notFound()
  }

  const { page, per_page, store_page } = searchParams

  // Products transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

  const productsTransaction = await getProducts(searchParams)

  // Stores transaction
  const storesLimit = 25
  const storesOffset =
    typeof store_page === "string"
      ? (parseInt(store_page) - 1) * storesLimit
      : 0

  const storesTransaction = await getStores(searchParams)

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
          {/* <Products
            products={productsTransaction.data}
            pageCount={productsTransaction.pageCount}
            categories={Object.values(products.category.enumValues)}
            stores={storesTransaction.data}
            storePageCount={storesTransaction.pageCount}
          /> */}
          <AlertCard />
        </div>
      </div>
    </Shell>
  )
}
