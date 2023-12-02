import * as React from "react"
import { unstable_noStore as noStore } from "next/cache"
import Link from "next/link"
import { db } from "@/db"
import { products } from "@/db/schema"
import type { Category } from "@/types"
import { eq, sql } from "drizzle-orm"

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

export async function CategoryCard({ category }: CategoryCardProps) {
  noStore()

  const productCount = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(products)
    .where(eq(products.category, category.title))
    .execute()
    .then((res) => res[0]?.count ?? 0)
    .catch(() => 0)

  return (
    <Link key={category.title} href={`/categories/${category.title}`}>
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
            <CardDescription>{productCount} products</CardDescription>
          </React.Suspense>
        </CardContent>
      </Card>
    </Link>
  )
}
