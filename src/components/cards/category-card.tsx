import Image from "next/image"
import Link from "next/link"
import { db } from "@/db"
import { products } from "@/db/schema"
import type { Category } from "@/types"
import { eq, sql } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CategoryCardProps {
  category: Category
}

export async function CategoryCard({ category }: CategoryCardProps) {
  const productCount = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(products)
    .where(eq(products.category, category.title))
    .execute()
    .then((res) => res[0]?.count ?? 0)

  return (
    <Link key={category.title} href={`/categories/${category.title}`}>
      <Card className="group relative overflow-hidden rounded-md bg-transparent">
        <div className="absolute inset-0 z-10 bg-zinc-950/75" />
        <Image
          src={category.image}
          alt={`${category.title} category`}
          className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
          fill
          loading="lazy"
        />
        <CardHeader className="relative z-20">
          <div
            className={cn(
              buttonVariants({
                size: "icon",
                className:
                  "pointer-events-none h-8 w-8 rounded-full bg-zinc-100 text-zinc-950",
              })
            )}
            aria-hidden="true"
          >
            <category.icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="relative z-20">
          <CardTitle className="text-xl capitalize text-zinc-200">
            {category.title}
          </CardTitle>
          <CardDescription>{productCount} products</CardDescription>
        </CardContent>
      </Card>
      <span className="sr-only">{category.title}</span>
    </Link>
  )
}
