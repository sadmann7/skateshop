import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

import { UpdateProductForm } from "@/components/forms/update-product-form"

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit your product.",
}

interface EditProductPageProps {
  params: {
    productId: string
  }
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    columns: {
      id: true,
    },
  })

  if (!product) {
    notFound()
  }

  return <UpdateProductForm productId={product.id} />
}
