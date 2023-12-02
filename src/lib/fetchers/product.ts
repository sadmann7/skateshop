import { unstable_noStore as noStore } from "next/cache"
import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  lte,
  not,
  sql,
} from "drizzle-orm"
import { stores } from "drizzle/schema"
import { z } from "zod"

import { getProductSchema, getProductsSchema } from "@/lib/validations/product"

export async function getProducts(rawInput: z.infer<typeof getProductsSchema>) {
  noStore()
  try {
    const input = getProductsSchema.parse(rawInput)

    const [column, order] = (input.sort?.split(".") as [
      keyof Product | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"]
    const [minPrice, maxPrice] = input.price_range?.split("-") ?? []
    const categories =
      (input.categories?.split(".") as Product["category"][]) ?? []
    const subcategories = input.subcategories?.split(".") ?? []
    const storeIds = input.store_ids?.split(".").map(Number) ?? []

    const { items, count } = await db.transaction(async (tx) => {
      const items = await tx
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

      return {
        items,
        count,
      }
    })

    return {
      items,
      count,
    }
  } catch (err) {
    console.error(err)
    throw err instanceof Error
      ? err.message
      : err instanceof z.ZodError
        ? err.issues.map((issue) => issue.message).join("\n")
        : new Error("Unknown error.")
  }
}

export async function checkProduct(input: { name: string; id?: number }) {
  noStore()
  try {
    const productWithSameName = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: input.id
        ? and(not(eq(products.id, input.id)), eq(products.name, input.name))
        : eq(products.name, input.name),
    })

    if (productWithSameName) {
      throw new Error("Product name already taken.")
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

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
