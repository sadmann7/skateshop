import { type Product } from "@/db/schema"

import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"
import { getProductsAction } from "@/app/_actions/product"
import { getStoresAction } from "@/app/_actions/store"

// Running out of edge function execution units on vercel free plan
// export const runtime = "edge"

interface CategoryPageProps {
  params: {
    category: Product["category"]
  }
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export function generateMetadata({ params }: CategoryPageProps) {
  return {
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = params
  const {
    page,
    per_page,
    sort,
    subcategories,
    price_range,
    store_ids,
    store_page,
  } = searchParams

  // Products transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

  const productsTransaction = await getProductsAction({
    limit,
    offset,
    sort: typeof sort === "string" ? sort : null,
    categories: category,
    subcategories: typeof subcategories === "string" ? subcategories : null,
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
        title={toTitleCase(category)}
        description={`Buy ${category} from the best stores`}
        size="sm"
      />
      <Products
        products={productsTransaction.items}
        pageCount={pageCount}
        category={category}
        stores={storesTransaction.items}
        storePageCount={storePageCount}
      />
    </Shell>
  )
}
