import { notFound } from "next/navigation"

import { getCurrentUser } from "@/lib/session"
import { AddProductForm } from "@/components/forms/add-product-form"

interface StorePageProps {
  params: {
    storeId: string
  }
}

export default async function NewStorePage({ params }: StorePageProps) {
  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <AddProductForm />
    </section>
  )
}
