import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { getUserSubscriptionPlan } from "@/lib/subscription"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Stores",
  description: "Manage your stores.",
}

export default async function StoresPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
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

  const subscriptionPlan = await getUserSubscriptionPlan(user.id)

  return (
    <Shell>
      <Header title="Stores" description="Manage your stores." size="sm" />
      <div className="space-y-4">
        <Alert>
          <Icons.warning className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You are on the {subscriptionPlan?.name.toLowerCase()} plan. Upgrade
            to the kickflip plan to create up to 3 stores.
          </AlertDescription>
        </Alert>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {userStores.map((store) => (
            <Link
              aria-label={`Go to ${store.name}`}
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
      </div>
    </Shell>
  )
}
