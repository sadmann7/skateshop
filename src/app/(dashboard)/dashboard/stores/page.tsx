import * as React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { env } from "@/env.js"

import { getStoresByUserId } from "@/lib/actions/store"
import { getCacheduser, getProgress } from "@/lib/actions/user"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"
import { StoreCardSkeleton } from "@/components/skeletons/store-card-skeleton"

import { AddStoreDialog } from "./_components/add-store-dialog"
import { Stores } from "./_components/stores"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Manage your stores",
}

export default async function StoresPage() {
  const user = await getCacheduser()

  if (!user) {
    redirect("/signin")
  }

  const storesPromise = getStoresByUserId({ userId: user.id })
  const progressPromise = getProgress({ userId: user.id })

  return (
    <Shell variant="sidebar">
      <PageHeader>
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Stores
          </PageHeaderHeading>
          <AddStoreDialog userId={user.id} progressPromise={progressPromise} />
        </div>
        <PageHeaderDescription size="sm">
          Manage your stores
        </PageHeaderDescription>
      </PageHeader>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <React.Suspense
          fallback={Array.from({ length: 3 }).map((_, i) => (
            <StoreCardSkeleton key={i} />
          ))}
        >
          <Stores storesPromise={storesPromise} />
        </React.Suspense>
      </section>
    </Shell>
  )
}
