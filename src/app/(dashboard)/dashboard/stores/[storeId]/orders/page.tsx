import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { env } from "@/env.mjs"
import { eq } from "drizzle-orm"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
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
