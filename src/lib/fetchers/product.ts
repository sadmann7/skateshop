"use server"

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from "next/cache"
import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import type { Category } from "@/types"
import { and, asc, desc, eq, gt, gte, inArray, lt, lte, sql } from "drizzle-orm"
import { stores } from "drizzle/schema"
import { z } from "zod"

import {
  getProductSchema,
  type getProductsSchema,
} from "@/lib/validations/product"

// See the unstable_cache API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_cache
export async function getFeaturedProducts() {
  try {
    return await cache(
      async () => {
        return db
          .select({
            id: products.id,
            name: products.name,
            images: products.images,
            category: products.category,
            price: products.price,
            inventory: products.inventory,
            stripeAccountId: stores.stripeAccountId,
          })
          .from(products)
          .limit(8)
          .leftJoin(stores, eq(products.storeId, stores.id))
          .groupBy(products.id)
          .orderBy(
            desc(sql<number>`count(${stores.stripeAccountId})`),
            desc(sql<number>`count(${products.images})`),
            desc(products.createdAt)
          )
      },
      ["featured-products"],
      {
        revalidate: 3600,
        tags: ["featured-products"],
      }
    )()
  } catch (err) {
    console.error(err)
    return []
  }
}

// See the unstable_noStore API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_noStore
export async function getProducts(input: z.infer<typeof getProductsSchema>) {
  noStore()
  try {
    const [column, order] = (input.sort?.split(".") as [
      keyof Product | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"]
    const [minPrice, maxPrice] = input.price_range?.split("-") ?? []
    const categories =
      (input.categories?.split(".") as Product["category"][]) ?? []
    const subcategories = input.subcategories?.split(".") ?? []
    const storeIds = input.store_ids?.split(".").map(Number) ?? []

    const transaction = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          images: products.images,
          category: products.category,
          subcategory: products.subcategory,
          price: products.price,
          inventory: products.inventory,
          rating: products.rating,
          tags: products.tags,
          storeId: products.storeId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(products)
        .limit(input.limit)
        .offset(input.offset)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .where(
          and(
            categories.length
              ? inArray(products.category, categories)
              : undefined,
            subcategories.length
              ? inArray(products.subcategory, subcategories)
              : undefined,
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined,
            storeIds.length ? inArray(products.storeId, storeIds) : undefined,
            input.active === "true"
              ? sql`(${stores.stripeAccountId}) is not null`
              : undefined
          )
        )
        .groupBy(products.id)
        .orderBy(
          column && column in products
            ? order === "asc"
              ? asc(products[column])
              : desc(products[column])
            : desc(products.createdAt)
        )

      const count = await tx
        .select({
          count: sql<number>`count(*)`,
        })
        .from(products)
        .where(
          and(
            categories.length
              ? inArray(products.category, categories)
              : undefined,
            subcategories.length
              ? inArray(products.subcategory, subcategories)
              : undefined,
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined,
            storeIds.length ? inArray(products.storeId, storeIds) : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      const pageCount = Math.ceil(count / input.limit)

      return {
        data,
        pageCount,
      }
    })

    return transaction
  } catch (err) {
    console.error(err)
    return {
      data: [],
      pageCount: 0,
    }
  }
}

export async function getProductCount({ category }: { category: Category }) {
  noStore()
  try {
    return await db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(products)
      .where(eq(products.category, category.title))
      .execute()
      .then((res) => res[0]?.count ?? 0)
  } catch (err) {
    console.error(err)
    return null
  }
}

export type ProductCountPromise = ReturnType<typeof getProductCount>

export async function getNextProductId(
  rawInput: z.infer<typeof getProductSchema>
) {
  noStore()
  try {
    const input = getProductSchema.parse(rawInput)

    const product = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: and(
        eq(products.storeId, input.storeId),
        gt(products.id, input.id)
      ),
      orderBy: asc(products.id),
    })

    if (!product) {
      throw new Error("Product not found.")
    }

    return product.id
  } catch (err) {
    console.error(err)
    throw err instanceof Error
      ? err.message
      : err instanceof z.ZodError
        ? err.issues.map((issue) => issue.message).join("\n")
        : new Error("Unknown error.")
  }
}

export async function getPreviousProductId(
  rawInput: z.infer<typeof getProductSchema>
) {
  noStore()
  try {
    const input = getProductSchema.parse(rawInput)

    const product = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: and(
        eq(products.storeId, input.storeId),
        lt(products.id, input.id)
      ),
      orderBy: desc(products.id),
    })

    if (!product) {
      throw new Error("Product not found.")
    }

    return product.id
  } catch (err) {
    console.error(err)
    throw err instanceof Error
      ? err.message
      : err instanceof z.ZodError
        ? err.issues.map((issue) => issue.message).join("\n")
        : new Error("Unknown error.")
  }
}
