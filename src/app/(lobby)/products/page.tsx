import { type Metadata } from "next"
import { products } from "@/db/schema"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"

import { getProducts } from "@/lib/fetchers/product"
import { getStores } from "@/lib/fetchers/store"
import { productsSearchParamsSchema } from "@/lib/validations/params"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shells/shell"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Products",
  description: "Buy products from our stores",
}

interface ProductsPageProps {
  searchParams: SearchParams
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const {
    page,
    per_page,
    sort,
    categories,
    subcategories,
    price_range,
    store_ids,
    store_page,
    active,
  } = productsSearchParamsSchema.parse(searchParams)

  // Products transaction
  const fallbackPage = isNaN(page) || page < 1 ? 1 : page
  // Number of items per page
  const limit = isNaN(per_page) ? 10 : per_page
  // Number of items to skip
  const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0

  const productsTransaction = await getProducts({
    limit,
    offset,
    sort,
    categories,
    subcategories,
    price_range,
    store_ids,
    active,
  })

  // Stores transaction
  const fallbackStoresPage =
    isNaN(store_page) || store_page < 1 ? 1 : store_page
  const storesLimit = 40
  const storesOffset =
    fallbackStoresPage > 0 ? (fallbackStoresPage - 1) * storesLimit : 0

  const storesTransaction = await getStores({
    limit: storesLimit,
    offset: storesOffset,
    sort: "productCount.desc",
  })

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Products</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>
      <Products
        products={productsTransaction.data}
        pageCount={productsTransaction.pageCount}
        categories={Object.values(products.category.enumValues)}
        stores={storesTransaction.data}
        storePageCount={storesTransaction.pageCount}
      />
    </Shell>
  )
}
