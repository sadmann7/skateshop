import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

// Running out of edge function execution units on vercel free plan
// export const runtime = "edge"

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
          <Card key={store.id} className="flex h-full flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-1">{store.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {store.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link key={store.id} href={`/dashboard/stores/${store.id}`}>
                <div
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "h-8 w-full",
                    })
                  )}
                >
                  View store
                  <span className="sr-only">View {store.name} store</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
        {userStores.length < 3 && (
          <Card className="flex h-full flex-col">
            <CardHeader className="flex-1">
              <CardTitle className="line-clamp-1">Create a new store</CardTitle>
              <CardDescription className="line-clamp-2">
                Create a new store to start selling your products.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/stores/new">
                <div
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "h-8 w-full",
                    })
                  )}
                >
                  Create a store
                  <span className="sr-only">Create a new store</span>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Shell>
  )
}
