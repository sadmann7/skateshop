import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import { eq } from "drizzle-orm"

import { toTitleCase } from "@/lib/utils"
import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Category",
  description: "Buy products from this category",
}

interface ProductCateogryPageProps {
  params: {
    category: Product["category"]
  }
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function generateMetadata({ params }: ProductCateogryPageProps) {
  return {
    title: toTitleCase(params.category),
    description: `Buy products from the ${params.category} category`,
  }
}

export default async function ProductCateogryPage({
  params,
}: ProductCateogryPageProps) {
  const { category } = params

  if (!(category satisfies Product["category"])) {
    notFound()
  }

  const allProducts = await db
    .select()
    .from(products)
    .where(eq(products.category, category))

  if (!allProducts) {
    notFound()
  }

  return (
    <Shell>
      <Header
        className="capitalize"
        title={category}
        description={`Buy ${category} gear from your local skate shop`}
      />
    </Shell>
  )
}
