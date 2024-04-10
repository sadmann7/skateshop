import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env.js"
import { currentUser } from "@clerk/nextjs"

import { getCategories, getSubcategories } from "@/lib/actions/product"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { AddProductForm } from "./_components/add-product-form"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "New Product",
  description: "Add a new product",
}

interface NewProductPageProps {
  params: {
    storeId: string
  }
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const storeId = decodeURIComponent(params.storeId)

  const user = await currentUser()

  if (!user) {
    redirect("/sigin")
  }

  const promises = Promise.all([getCategories(), getSubcategories()]).then(
    ([categories, subcategories]) => ({ categories, subcategories })
  )

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
      </CardHeader>
      <CardContent>
        <AddProductForm storeId={storeId} promises={promises} />
      </CardContent>
    </Card>
  )
}
