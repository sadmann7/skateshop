import { products, type Product } from "@/db/schema"

import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"
import { getProductsAction } from "@/app/_actions/product"
import { getStoresAction } from "@/app/_actions/store"

export const runtime = "edge"

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
  const { page, per_page, sort, price_range, store_ids, store_page } =
    searchParams

  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

  const productsTransaction = await getProductsAction({
    category,
    limit,
    offset,
    sort: typeof sort === "string" ? sort : null,
    price_range: typeof price_range === "string" ? price_range : null,
    store_ids: typeof store_ids === "string" ? store_ids : null,
  })

  const pageCount = Math.ceil(productsTransaction.total / limit)

  const storeLimit = 20

  const storesTransaction = await getStoresAction({
    limit: storeLimit,
    offset:
      typeof store_page === "string" ? (parseInt(store_page) - 1) * 20 : 0,
    sort: "name-asc",
  })

  const storePageCount = Math.ceil(storesTransaction.total / storeLimit)

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
        stores={storesTransaction.items}
        storePageCount={storePageCount}
        categories={Object.values(products.category.enumValues)}
      />
    </Shell>
  )
}
