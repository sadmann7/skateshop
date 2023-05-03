import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Icons } from "@/components/icons"

export const metadata: Metadata = {
  title: "Stores",
  description: "Manage your stores.",
}

export default async function StoresPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions.pages?.signIn || "/login")
  }

  const stores = await prisma.store.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      products: {
        select: {
          id: true,
        },
      },
    },
  })

  return (
    <section className="container grid w-full items-center gap-6 space-y-5 pb-20 pt-6 md:py-10">
      <Header
        title="Your Stores"
        description="You can create up to 3 stores. Each store can have up to 100 products."
      />

      {stores?.length ? (
        <div className="grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3">
          {stores.map((store) => (
            <Link key={store.id} href={`/account/stores/${store.id}`}>
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
          {stores.length < 3 && (
            <Link href="/account/stores/add">
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
        <div className="grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}
    </section>
  )
}
