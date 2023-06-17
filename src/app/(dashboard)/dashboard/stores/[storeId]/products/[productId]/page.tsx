import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { and, eq } from "drizzle-orm"

import { UpdateProductForm } from "@/components/forms/update-product-form"

export const metadata: Metadata = {
  title: "Manage Product",
  description: "Manage your product",
}

interface EditProductPageProps {
  params: {
    storeId: string
    productId: string
  }
}

export default async function UpdateProductPage({
  params,
}: EditProductPageProps) {
  const storeId = Number(params.storeId)
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.storeId, storeId)),
  })

  if (!product) {
    notFound()
  }

  return <UpdateProductForm product={product} />
}
