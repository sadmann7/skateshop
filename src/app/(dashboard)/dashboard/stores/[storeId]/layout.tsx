import { notFound, redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"
import { StoreNavigator } from "@/components/store-navigator"
import { StoreTabs } from "@/components/store-tabs"

interface StoreLayoutProps {
  children: React.ReactNode
  params: {
    storeId: string
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const storeId = Number(params.storeId)

  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId),
    columns: {
      id: true,
      name: true,
    },
  })

  if (!store) {
    notFound()
  }

  return (
    <Shell layout="dashboard">
      <div className="flex items-center space-x-4">
        <Header title={store.name} size="sm" className="flex-1" />
        <StoreNavigator storeId={storeId} userId={user.id} />
      </div>
      <div className="space-y-4 overflow-hidden">
        <StoreTabs storeId={storeId} />
        {children}
      </div>
    </Shell>
  )
}
