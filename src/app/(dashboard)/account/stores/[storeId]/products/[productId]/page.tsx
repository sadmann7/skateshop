import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { prisma } from "@/lib/db"
import { AddProductForm } from "@/components/forms/add-product-form"
import { EditProductForm } from "@/components/forms/edit-product-form"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Manage Store",
  description: "Manage your store and products.",
}

interface EditProductPageProps {
  params: {
    productId: string
  }
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = params

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      price: true,
      quantity: true,
      inventory: true,
    },
  })

  if (!product) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-6 pb-8 pt-6 md:py-10">
      <Header
        title="Manage Store"
        description="Manage your store and products."
      />
      <EditProductForm productId={product.id} />
    </section>
  )
}
