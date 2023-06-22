import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const runtime = "edge"

export const metadata: Metadata = {
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  const userStores = await db.query.stores.findMany({
    where: eq(stores.userId, user.id),
    with: {
      products: {
        columns: {
          id: true,
        },
      },
    },
  })

  return (
    <Shell layout="dashboard">
      <Header title="Stores" description="Manage your stores" size="sm" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {userStores.map((store) => (
          <Link
            aria-label={store.name}
            key={store.id}
            href={`/dashboard/stores/${store.id}`}
          >
            <Card className="h-full hover:bg-muted">
              <CardHeader>
                <CardTitle className="line-clamp-1">{store.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {store.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        {userStores.length < 3 && (
          <Link aria-label="Create a new store" href="/dashboard/stores/new">
            <Card className="h-full hover:bg-muted">
              <CardHeader>
                <CardTitle className="line-clamp-1">
                  Create a new store
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  Create a new store to start selling your products.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        )}
      </div>
    </Shell>
  )
}
