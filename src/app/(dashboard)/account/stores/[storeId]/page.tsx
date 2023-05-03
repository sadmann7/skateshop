import { notFound } from "next/navigation"

import { prisma } from "@/lib/db"
import { AddProductForm } from "@/components/forms/add-product-form"

interface StorePageProps {
  params: {
    storeId: string
  }
}

export default async function StorePage({ params }: StorePageProps) {
  const { storeId } = params

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <AddProductForm />
    </section>
  )
}
