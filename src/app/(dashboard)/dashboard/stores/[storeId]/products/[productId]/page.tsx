import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

import { EditProductForm } from "@/components/forms/edit-product-form"
import { Header } from "@/components/header"

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

  return (
    <section className="grid items-center gap-6 pb-8 pt-6 md:py-8">
      <Header title="Edit Product" description="Edit your product." />
      <EditProductForm productId={product.id} />
    </section>
  )
}
