import * as React from "react"
import Link from "next/link"
import type { Category } from "@/types"

import {
  getProductCount,
  type ProductCountPromise,
} from "@/lib/fetchers/product"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const productCountPromise = getProductCount({ category })

  return (
    <Link href={`/categories/${category.title}`}>
      <span className="sr-only">{category.title}</span>
      <Card className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted/50">
        <CardHeader>
          <div className="grid h-11 w-11 place-items-center rounded-full border-2">
            <category.icon className="h-5 w-5" aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-1.5">
          <CardTitle className="capitalize">{category.title}</CardTitle>
          <React.Suspense fallback={<Skeleton className="h-4 w-20" />}>
            <ProductCount productCountPromise={productCountPromise} />
          </React.Suspense>
        </CardContent>
      </Card>
    </Link>
  )
}

interface ProductCountProps {
  productCountPromise: ProductCountPromise
}

async function ProductCount({ productCountPromise }: ProductCountProps) {
  const productCount = await productCountPromise

  return <CardDescription>{productCount} products</CardDescription>
}
