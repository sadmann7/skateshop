import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"

import { Header } from "@/components/header"
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
      <Header title={product.name} description={product.description} />
    </Shell>
  )
}
