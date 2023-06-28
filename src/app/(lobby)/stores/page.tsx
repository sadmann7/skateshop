import { type Metadata } from "next"

import { Header } from "@/components/header"
import { Stores } from "@/components/stores"
import { Shell } from "@/components/shell"
import { getStoresAction } from "@/app/_actions/store"

export const runtime = "edge"

export const metadata: Metadata = {
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
    // store_ids,
    store_page,
  } = searchParams

  // Stores transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

  const StoresTransaction = await getStoresAction({
    limit: limit,
    offset: offset,
    sort: typeof sort === "string" ? sort : "id.asc",
    // store_ids: typeof store_ids === "string" ? store_ids : null,
  })

  const pageCount = Math.ceil(StoresTransaction.total / limit)

  // Stores transaction
  const storesLimit = 25
  const storesOffset =
    typeof store_page === "string"
      ? (parseInt(store_page) - 1) * storesLimit
      : 0

  const storesTransaction = await getStoresAction({
    limit: storesLimit,
    offset: storesOffset,
    sort: "name.asc",
  })

  const storePageCount = Math.ceil(storesTransaction.total / storesLimit)

  return (
    <Shell>
      <Header
        title="Stores"
        description="Buy Stores from our stores"
        size="sm"
      />
      <Stores
        stores={storesTransaction.items}
        pageCount={pageCount}
        storePageCount={storePageCount}
      />
    </Shell>
  )
}