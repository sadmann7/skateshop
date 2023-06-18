import { type Metadata } from "next"
import { products, type Product } from "@/db/schema"

import { Header } from "@/components/header"
import { Products } from "@/components/products"
import { Shell } from "@/components/shell"
import { getProductsAction } from "@/app/_actions/product"

export const metadata: Metadata = {
  title: "Products",
  description: "Buy products from our stores",
}

interface ProductsPageProps {
  searchParams: {
    page?: string
    per_page?: string
    sort?: `${keyof Product}-${"asc" | "desc"}`
    price_range?: string
    store_ids?: string
  }
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { page, per_page, sort, price_range, store_ids } = searchParams

  const limit = per_page ? parseInt(per_page) : 8
  const offset = page ? (parseInt(page) - 1) * limit : 0

  const productsTransaction = await getProductsAction({
    limit,
    offset,
    sort,
    price_range,
    store_ids,
  })

  const pageCount = Math.ceil(productsTransaction.total / limit)

  return (
    <Shell>
      <Header title="Products" description="Buy products from our stores" />
      <Products
        products={productsTransaction.items}
        pageCount={pageCount}
        categories={Object.values(products.category.enumValues)}
      />
    </Shell>
  )
}
