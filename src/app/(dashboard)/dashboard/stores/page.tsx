import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"

import { Header } from "@/components/header"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Dashboard",
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

  return (
    <section className="container grid w-full items-center gap-10 pb-10 pt-6 md:py-10">
      <Header
        title="Your Stores"
        description="You can create up to 3 stores. Each store can have up to 100 products."
      />
      {userStores?.length ? (
        <div className="grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3">
          {userStores.map((store) => (
            <Link key={store.id} href={`/account/stores/${store.id}/products`}>
              <div className="flex h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
                <div className="flex items-center space-x-2">
                  <Icons.store className="h-5 w-5 text-muted-foreground" />
                  <h2 className="line-clamp-1 flex-1 text-lg font-bold">
                    {store.name}
                  </h2>
                </div>
                <p className="mt-2.5 line-clamp-2 flex-1 text-base text-muted-foreground">
                  {store.description}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {store.products.length} products
                </p>
              </div>
              <span className="sr-only">{store.name}</span>
            </Link>
          ))}
          {userStores.length < 3 && (
            <Link href="/account/stores/new">
              <div className="flex h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
                <div className="flex items-center space-x-2">
                  <Icons.add className="h-5 w-5 text-muted-foreground" />
                  <h2 className="line-clamp-1 flex-1 text-lg font-bold">
                    Create a new store
                  </h2>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  Create a new store to start selling your products.
                </p>
              </div>
              <span className="sr-only">Create a new store</span>
            </Link>
          )}
        </div>
      ) : (
        <Link href="/account/stores/new" className="w-fit">
          <div className="flex aspect-video h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
            <div className="flex items-center space-x-2">
              <Icons.add className="h-5 w-5 text-muted-foreground" />
              <h2 className="line-clamp-1 flex-1 text-lg font-bold">
                Create a new store
              </h2>
            </div>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Create a new store to start selling your products.
            </p>
          </div>
          <span className="sr-only">Create a new store</span>
        </Link>
      )}
    </section>
  )
}
