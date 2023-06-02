import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { eq } from "drizzle-orm"

import { StoreTabs } from "@/components/store-tabs"

export const metadata: Metadata = {
  title: "Manage Store",
  description: "Manage your store.",
}

interface OrdersPageProps {
  params: {
    storeId: number
  }
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const { storeId } = params

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
      description: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <section className="container grid w-full items-center gap-6 pb-10 pt-6 md:py-10">
      <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
      <StoreTabs storeId={storeId} activeTab="orders" />
    </section>
  )
}
