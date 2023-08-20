import { type Metadata } from "next"
import { env } from "@/env.mjs"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shells/shell"
import { Stores } from "@/components/stores"
import { getStoresAction } from "@/app/_actions/store"

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

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const { page, per_page, sort } = searchParams ?? {}

  // Stores transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0

  const storesTransaction = await getStoresAction({
    limit: limit,
    offset: offset,
    sort: typeof sort === "string" ? sort : "productCount.desc",
  })

  const pageCount = Math.ceil(storesTransaction.total / limit)

  return (
    <Shell>
      <PageHeader
        id="stores-page-header"
        aria-labelledby="stores-page-header-heading"
      >
        <PageHeaderHeading size="sm">Stores</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>
      <Stores
        id="stores-page-stores"
        aria-labelledby="stores-page-stores-heading"
        stores={storesTransaction.items}
        pageCount={pageCount}
      />
    </Shell>
  )
}
