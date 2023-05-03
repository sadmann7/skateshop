import Link from "next/link"
import { notFound } from "next/navigation"

import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

export default async function StoresPage() {
  const user = await getCurrentUser()

  if (!user) {
    notFound()
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
    <section className="container grid items-center gap-6 space-y-5 pb-20 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl">
          Your Stores
        </h1>
        <p className="max-w-[700px] text-base text-muted-foreground sm:text-lg">
          You can create up to 3 stores. Each store can have up to 100 products.
        </p>
      </div>
      {stores?.length ? (
        <div className="grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-3">
          {stores.map((store) => (
            <Link key={store.id} href={`/account/stores/${store.id}`}>
              <div className="flex h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
                <div className="flex items-center space-x-2">
                  <Icons.store className="h-5 w-5 text-muted-foreground" />
                  <h2 className="line-clamp-1 text-base font-bold sm:text-lg">
                    {store.name}
                  </h2>
                </div>
                <p className="mt-2.5 line-clamp-2 flex-1 text-sm text-muted-foreground sm:text-base">
                  {store.description}
                </p>
                <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  {store.products.length} products
                </p>
              </div>
            </Link>
          ))}
          {stores.length < 3 && (
            <Link href="/account/stores/new">
              <div className="flex h-40 flex-col rounded-md border p-5 shadow-md hover:bg-muted">
                <div className="flex items-center space-x-2">
                  <Icons.add className="h-5 w-5 text-muted-foreground" />
                  <h2 className="line-clamp-1 text-base font-bold sm:text-lg">
                    Create a new store
                  </h2>
                </div>
                <p className="mt-2.5 line-clamp-2 flex-1 text-sm text-muted-foreground sm:text-base">
                  Create a new store to start selling your products.
                </p>
              </div>
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
