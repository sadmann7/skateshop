import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products } from "@/db/schema"
import { and, eq } from "drizzle-orm"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UpdateProductForm } from "@/components/forms/update-product-form"
import { ProductNavigator } from "@/components/product-navigator"
import { env } from "@/env.mjs"

export const metadata: Metadata = {
  metadataBase: new URL(env.METADATA_BASE),
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

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <CardTitle className="text-2xl">Update product</CardTitle>
          <ProductNavigator product={product} />
        </div>
        <CardDescription>
          Update your product information, or delete it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateProductForm product={product} />
      </CardContent>
    </Card>
  )
}
