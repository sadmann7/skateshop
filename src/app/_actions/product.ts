"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import type { StoredFile } from "@/types"
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  like,
  lt,
  lte,
  not,
  sql,
} from "drizzle-orm"
import { type z } from "zod"

import type {
  getProductSchema,
  getProductsSchema,
  productSchema,
} from "@/lib/validations/product"

export async function filterProductsAction(query: string) {
  if (typeof query !== "string") {
    throw new Error("Invalid input.")
  }

  if (query.length === 0) return null

  const filteredProducts = await db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
    })
    .from(products)
    .where(like(products.name, `%${query}%`))
    .orderBy(desc(products.createdAt))
    .limit(10)

  const productsByCategory = Object.values(products.category.enumValues).map(
    (category) => ({
      category,
      products: filteredProducts.filter(
        (product) => product.category === category
      ),
    })
  )

  return productsByCategory
}

export async function getProductsAction(
  input: z.infer<typeof getProductsSchema>
) {
  const [column, order] =
    (input.sort?.split(".") as [
      keyof Product | undefined,
      "asc" | "desc" | undefined
    ]) ?? []
  const [minPrice, maxPrice] = input.price_range?.split("-") ?? []
  const categories =
    (input.categories?.split(".") as Product["category"][]) ?? []
  const subcategories = input.subcategories?.split(".") ?? []
  const storeIds = input.store_ids?.split(".").map(Number) ?? []

  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx
      .select()
      .from(products)
      .limit(input.limit)
      .offset(input.offset)
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
      .orderBy(
        column && column in products
          ? order === "asc"
            ? asc(products[column])
            : desc(products[column])
          : desc(products.createdAt)
      )

    const total = await tx
      .select({
        count: sql<number>`count(${products.id})`,
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

    return {
      items,
      total: Number(total[0]?.count) ?? 0,
    }
  })

  return {
    items,
    total,
  }
}

export async function checkProductAction(input: { name: string; id?: number }) {
  if (typeof input.name !== "string") {
    throw new Error("Invalid input.")
  }

  const productWithSameName = await db.query.products.findFirst({
    where: input.id
      ? and(not(eq(products.id, input.id)), eq(products.name, input.name))
      : eq(products.name, input.name),
  })

  if (productWithSameName) {
    throw new Error("Product name already taken.")
  }
}

export async function addProductAction(
  input: z.infer<typeof productSchema> & {
    storeId: number
    images: StoredFile[] | null
  }
) {
  const productWithSameName = await db.query.products.findFirst({
    where: eq(products.name, input.name),
  })

  if (productWithSameName) {
    throw new Error("Product name already taken.")
  }

  await db.insert(products).values({
    ...input,
    storeId: input.storeId,
    images: input.images,
  })

  revalidatePath(`/dashboard/stores/${input.storeId}/products.`)
}

export async function updateProductAction(
  input: z.infer<typeof productSchema> & {
    storeId: number
    id: number
    images: StoredFile[] | null
  }
) {
  if (typeof input.id !== "number") {
    throw new Error("Invalid input.")
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
  })

  if (!product) {
    throw new Error("Product not found.")
  }

  await db.update(products).set(input).where(eq(products.id, input.id))

  revalidatePath(`/dashboard/stores/${input.storeId}/products/${input.id}`)
}

export async function deleteProductAction(
  input: z.infer<typeof getProductSchema>
) {
  if (typeof input.storeId !== "number" || typeof input.id !== "number") {
    throw new Error("Invalid input.")
  }

  and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
    await db
      .delete(products)
      .where(
        and(eq(products.id, input.id), eq(products.storeId, input.storeId))
      )

  revalidatePath(`/dashboard/stores/${input.storeId}/products`)
}

export async function deleteProductsAction(input: {
  storeId: number
  ids: number[]
}) {
  if (typeof input.storeId !== "number") {
    throw new Error("Invalid input.")
  }

  if (input.ids.some((id) => typeof id !== "number")) {
    throw new Error("Invalid input.")
  }

  await db
    .delete(products)
    .where(
      and(
        input.ids.length > 0 ? inArray(products.id, input.ids) : undefined,
        eq(products.storeId, input.storeId)
      )
    )

  revalidatePath(`/dashboard/stores/${input.storeId}/products`)
}

export async function getNextProductIdAction(
  input: z.infer<typeof getProductSchema>
) {
  if (typeof input.storeId !== "number" || typeof input.id !== "number") {
    throw new Error("Invalid input.")
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.storeId, input.storeId), gt(products.id, input.id)),
    orderBy: asc(products.id),
  })

  if (!product) {
    throw new Error("Product not found.")
  }

  return product.id
}

export async function getPreviousProductIdAction(
  input: z.infer<typeof getProductSchema>
) {
  if (typeof input.storeId !== "number" || typeof input.id !== "number") {
    throw new Error("Invalid input.")
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.storeId, input.storeId), lt(products.id, input.id)),
    orderBy: desc(products.id),
  })

  if (!product) {
    throw new Error("Product not found.")
  }

  return product.id
}
