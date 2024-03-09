import * as React from "react"
import Link from "next/link"
import { BoxIcon } from "@radix-ui/react-icons"

import { getProductCount, type getCategories } from "@/lib/actions/product"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryCardProps {
  category: Awaited<ReturnType<typeof getCategories>>[number]
}

export function CategoryCard({ category }: CategoryCardProps) {
  const productCountPromise = getProductCount({
    categoryName: category.name,
  })

  return (
    <Link href={`/categories/${category.name}`}>
      <span className="sr-only">{category.name}</span>
      <Card className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="grid size-11 place-items-center rounded-full border-2">
            <BoxIcon className="size-5" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-1.5">
          <CardTitle className="capitalize">{category.name}</CardTitle>
          <React.Suspense fallback={<Skeleton className="h-4 w-20" />}>
            <ProductCount productCountPromise={productCountPromise} />
          </React.Suspense>
        </CardContent>
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
