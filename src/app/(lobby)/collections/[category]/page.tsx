import type { Metadata } from "next"
import { env } from "@/env.js"
import type { SearchParams } from "@/types"

import { getProducts } from "@/lib/actions/product"
import { toTitleCase } from "@/lib/utils"
import { AlertCard } from "@/components/alert-card"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: SearchParams
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = decodeURIComponent(params.category)

  const productsTransaction = await getProducts(searchParams)

  console.log({ productsTransaction })

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">{toTitleCase(category)}</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          {`Buy ${category} from the best stores`}
        </PageHeaderDescription>
      </PageHeader>
      <AlertCard />
    </Shell>
  )
}
