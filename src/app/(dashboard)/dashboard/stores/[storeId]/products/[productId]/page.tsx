import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

import { EditProductForm } from "@/components/forms/edit-product-form"

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Edit your product.",
}

interface EditProductPageProps {
  params: {
    productId: number
  }
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = params

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    columns: {
      id: true,
    },
  })

  if (!product) {
    notFound()
  }

  return <EditProductForm productId={product.id} />
}
