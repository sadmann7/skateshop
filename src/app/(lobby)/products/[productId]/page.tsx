import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { type UploadedFile } from "@/types"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Product",
  description: "Product description",
}

interface PrdouctPageProps {
  params: {
    productId: number
  }
}

export default async function ProductPage({ params }: PrdouctPageProps) {
  const { productId } = params

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  })

  if (!product) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-6 pb-8 pt-6 md:py-10">
      <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
      <div className="relative mx-auto my-2 flex max-w-xl pt-[66.67%]">
        {(product?.images as UploadedFile[]).map((image, i) => (
          <fieldset key={image.id}></fieldset>
        ))}
      </div>
    </section>
  )
}
