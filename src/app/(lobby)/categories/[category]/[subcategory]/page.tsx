import { type Product } from "@/db/schema"

import { toTitleCase, unslugify } from "@/lib/utils"
import { Header } from "@/components/header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"
import { getProductsAction } from "@/app/_actions/product"
import { getStoresAction } from "@/app/_actions/store"

// Running out of edge function execution units on vercel free plan
// export const runtime = "edge"

interface SubcategoryPageProps {
  params: {
    category: Product["category"]
    subcategory: string
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export function generateMetadata({ params }: SubcategoryPageProps) {
  const subcategory = unslugify(params.subcategory)

  return {
    title: toTitleCase(subcategory),
    description: `Buy the best ${subcategory}`,
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: SubcategoryPageProps) {
  const { category, subcategory } = params
  const { page, per_page, sort, price_range, store_ids, store_page } =
    searchParams

  // Products transaction

  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

  const productsTransaction = await getProductsAction({
    limit,
    offset,
    sort: typeof sort === "string" ? sort : null,
    categories: category,
    subcategories: subcategory,
    price_range: typeof price_range === "string" ? price_range : null,
    store_ids: typeof store_ids === "string" ? store_ids : null,
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
    sort: "productCount.desc",
  })

  const storePageCount = Math.ceil(storesTransaction.total / storesLimit)

  return (
    <Shell>
      <Header
        title={toTitleCase(unslugify(subcategory))}
        description={`Buy the best ${unslugify(subcategory)}`}
        size="sm"
      />
      <Products
        products={productsTransaction.items}
        pageCount={pageCount}
        stores={storesTransaction.items}
        storePageCount={storePageCount}
      />
    </Shell>
  )
}
