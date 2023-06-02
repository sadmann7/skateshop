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
    <section className="grid items-center gap-6 pb-8 pt-6 md:py-8">
      <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
      <div className="space-y-4 overflow-hidden sm:space-y-0">
        <StoreTabs
          className="block sm:hidden"
          storeId={storeId}
          activeTab="products"
        />
        <div>Orders Table</div>
      </div>
    </section>
  )
}
