import * as React from "react"
import Link from "next/link"

import { getProductCount, type getCategories } from "@/lib/actions/product"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

interface CategoryCardProps {
  category: Awaited<ReturnType<typeof getCategories>>[number]
}

export function CategoryCard({ category }: CategoryCardProps) {
  const productCountPromise = getProductCount({
    categoryId: category.id,
  })

  return (
    <Link href={`/collections/${category.slug}`}>
      <Card className="relative flex size-full flex-col bg-muted p-4 transition-colors hover:bg-muted/50">
        <Icons.product
          className="size-10 text-muted-foreground"
          aria-hidden="true"
        />
        <div className="flex flex-1 flex-col space-y-1.5 pb-4 pt-10">
          <CardTitle className="capitalize">{category.name}</CardTitle>
          <CardDescription>{category.description}</CardDescription>
        </div>
        <React.Suspense
          fallback={
            <div className="pt-1">
              <Skeleton className="h-4 w-20" />
            </div>
          }
        >
          <ProductCount productCountPromise={productCountPromise} />
        </React.Suspense>
      </Card>
    </Link>
  )
}

interface ProductCountProps {
  productCountPromise: ReturnType<typeof getProductCount>
}

async function ProductCount({ productCountPromise }: ProductCountProps) {
  const { data } = await productCountPromise

  return <CardDescription>{data.count} products</CardDescription>
}
