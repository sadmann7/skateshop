import Image from "next/image"
import Link from "next/link"
import { db } from "@/db"
import { products } from "@/db/schema"
import type { Category } from "@/types"
import { eq, sql } from "drizzle-orm"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"

import { buttonVariants } from "../ui/button"

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
    <Link
      aria-label={category.title}
      key={category.title}
      href={`/categories/${category.title}`}
      className="group relative overflow-hidden rounded-md border"
    >
      <AspectRatio ratio={16 / 9}>
        <div className="absolute inset-0 z-10 bg-zinc-950/70 transition-colors group-hover:bg-zinc-950/75" />
        <Image
          src={category.image}
          alt={`${category.title} category`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          className="object-cover transition-transform group-hover:scale-105"
          priority
        />
      </AspectRatio>
      <div className="absolute inset-4 z-20 flex flex-col text-zinc-100">
        <div className="flex items-start justify-between space-x-4">
          <div
            className={cn(
              buttonVariants({
                size: "icon",
                className:
                  "pointer-events-none rounded-full bg-zinc-50 text-zinc-950",
              })
            )}
          >
            <category.icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <Badge className="pointer-events-none rounded-sm bg-zinc-50 px-2 py-1 font-semibold text-zinc-950">
            {productCount} items
          </Badge>
        </div>
        <h3 className="mt-auto text-xl font-medium capitalize">
          {category.title}
        </h3>
      </div>
    </Link>
  )
}
