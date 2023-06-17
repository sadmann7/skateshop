import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

import { AddProductForm } from "@/components/forms/add-product-form"

export const metadata: Metadata = {
  title: "New Product",
  description: "Add a new product",
}

interface NewProductPageProps {
  params: {
    storeId: string
  }
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const storeId = Number(params.storeId)

  const user = await currentUser()

  if (!user) {
    redirect("/sigin")
  }

  return <AddProductForm storeId={storeId} />
}
