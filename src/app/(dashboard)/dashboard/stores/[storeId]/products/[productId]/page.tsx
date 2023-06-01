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
    <section className="container grid w-full items-center gap-10 pb-10 pt-6 md:py-10">
      <Header title="Edit Product" description="Edit your product." />
      <EditProductForm productId={product.id} />
    </section>
  )
}
