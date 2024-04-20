import * as React from "react"
import Link from "next/link"

import { getProductCount, type getCategories } from "@/lib/actions/product"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryCardProps {
  category: Awaited<ReturnType<typeof getCategories>>[number]
}

export function CategoryCard({ category }: CategoryCardProps) {
  const productCountPromise = getProductCount({
    categoryId: category.id,
  })

  return (
    <Link href={`/collections/${category.slug}`}>
      <Card className="flex size-full flex-col gap-4 rounded-md p-5 transition-colors hover:bg-muted/25">
        <div className="flex flex-1 flex-col space-y-1">
          <CardTitle className="capitalize">{category.name}</CardTitle>
          <CardDescription className="line-clamp-3 text-balance">
            {category.description}
          </CardDescription>
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
  const count = await productCountPromise

  return (
    <Badge
      variant="secondary"
      className="pointer-events-none w-fit rounded font-medium"
    >
      {count} products
    </Badge>
  )
}
