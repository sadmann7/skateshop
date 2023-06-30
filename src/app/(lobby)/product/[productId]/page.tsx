import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

import { Header } from "@/components/header"
import { ImageCarousel } from "@/components/image-carousel"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Product",
  description: "Product description",
}

interface PrdouctPageProps {
  params: {
    productId: string
  }
}

export default async function ProductPage({ params }: PrdouctPageProps) {
  const productId = Number(params.productId)

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })

  if (!product) {
    notFound()
  }

  return (
    <Shell>
      <Header title="Product" size="sm" />
      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <ImageCarousel
          className="w-full md:w-2/5"
          data={product.images ?? []}
        />
        <div className="w-full md:w-3/5">Add to cart</div>
      </div>
    </Shell>
  )
}
