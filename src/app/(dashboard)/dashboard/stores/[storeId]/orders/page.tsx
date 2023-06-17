import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Orders",
  description: "Manage your orders",
}

interface OrdersPageProps {
  params: {
    storeId: string
  }
}

export default async function OrdersPage({ params }: OrdersPageProps) {
  const storeId = Number(params.storeId)

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

  return <div>Orders Table</div>
}
