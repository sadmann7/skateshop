import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { prisma } from "@/lib/db"
import { Header } from "@/components/header"
import { Products } from "@/components/products"

export const metadata: Metadata = {
  title: "Manage Store",
  description: "Manage your store and products.",
}

interface EditStorePageProps {
  params: {
    storeId: string
  }
}

export default async function EditStorePage({ params }: EditStorePageProps) {
  const { storeId } = params

  const store = await prisma.store.findUnique({
    where: {
      id: storeId,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center space-y-12 pb-8 pt-6 md:py-10">
      <Header
        title={store.name}
        description="Manage your store and products."
      />
      <Products storeId={storeId} />
    </section>
  )
}
