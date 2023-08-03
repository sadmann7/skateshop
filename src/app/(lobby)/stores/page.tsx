import { type Metadata } from "next"
import { env } from "@/env.mjs"

import { Header } from "@/components/header"
import { Stores } from "@/components/stores"
import { Shell } from "@/components/shells/shell"
import { getPublicStoresAction } from "@/app/_actions/store"

export const runtime = "edge"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Stores",
  description: "Buy stores from our stores",
}

interface StoresPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default async function StoresPage({
  searchParams,
}: StoresPageProps) {
  const {
    page,
    per_page,
    sort,
  } = searchParams

  // Stores transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

  const storesTransaction = await getPublicStoresAction({
    limit: limit,
    offset: offset,
    sort: typeof sort === "string" ? sort : null,
  })

  const pageCount = Math.ceil(storesTransaction.total / limit)

  return (
    <Shell>
      <Header
        title="Stores"
        description="Buy products from our stores"
        size="sm"
      />
      <Stores
        stores={storesTransaction.items}
        pageCount={pageCount}
      />
    </Shell>
  )
}