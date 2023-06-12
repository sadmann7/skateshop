"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { products } from "@/db/schema"
import type { StoredFile } from "@/types"
import { and, asc, desc, eq, gt, like, lt, not } from "drizzle-orm"
import { type z } from "zod"

import type {
  getProductSchema,
  getProductsSchema,
  productSchema,
} from "@/lib/validations/product"

export async function filterProductsAction(query: string) {
  if (typeof query !== "string") {
    throw new Error("Query must be a string")
  }

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
  const limit = input.limit ?? 10

  const allProducts = await db
    .select()
    .from(products)
    .limit(limit + 1) // +1 to use as next cursor
    .where(
      and(
        input.category ? eq(products.category, input.category) : undefined,
        input.cursor
          ? (input.order === "desc" ? lt : gt)(products.id, input.cursor)
          : undefined,
        input.priceRange?.min
          ? gt(products.price, input.priceRange.min)
          : undefined,
        input.priceRange?.max
          ? lt(products.price, input.priceRange.max)
          : undefined
      )
    )
    .orderBy(
      input.order === "desc"
        ? desc(products[input.sort ?? "createdAt"])
        : asc(products[input.sort ?? "createdAt"])
    )

  let nextCursor: typeof input.cursor | undefined = undefined
  if (allProducts.length > limit) {
    const nextItem = allProducts.pop()
    nextCursor = nextItem?.id
  }

  return {
    products: allProducts,
    nextCursor,
  }
}

export async function checkProductAction(input: { name: string; id?: number }) {
  if (typeof input.name !== "string") {
    throw new Error("Invalid input")
  }

  const productWithSameName = await db.query.products.findFirst({
    where: input.id
      ? and(not(eq(products.id, input.id)), eq(products.name, input.name))
      : eq(products.name, input.name),
  })

  if (productWithSameName) {
    throw new Error("Product name already taken")
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
    throw new Error("Product name already taken")
  }

  await db.insert(products).values({
    ...input,
    storeId: input.storeId,
    images: input.images,
  })

  revalidatePath(`/dashboard/stores/${input.storeId}/products`)
}

export async function updateProductAction(
  input: z.infer<typeof productSchema> & {
    storeId: number
    id: number
    images: StoredFile[] | null
  }
) {
  if (typeof input.id !== "number") {
    throw new Error("Id must be a number")
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
  })

  if (!product) {
    throw new Error("Product not found")
  }

  await db.update(products).set(input).where(eq(products.id, input.id))

  revalidatePath(`/dashboard/stores/${input.storeId}/products/${input.id}`)
}

export async function deleteProductAction(
  input: z.infer<typeof getProductSchema>
) {
  if (typeof input.storeId !== "number" || typeof input.id !== "number") {
    throw new Error("Invalid input")
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
    throw new Error("Invalid input")
  }

  if (input.ids.some((id) => typeof id !== "number")) {
    throw new Error("Invalid input")
  }

  for (const id of input.ids) {
    await db
      .delete(products)
      .where(and(eq(products.id, id), eq(products.storeId, input.storeId)))
  }

  revalidatePath(`/dashboard/stores/${input.storeId}/products`)
}

export async function getNextProductIdAction(
  input: z.infer<typeof getProductSchema>
) {
  if (typeof input.storeId !== "number" || typeof input.id !== "number") {
    throw new Error("Invalid input")
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.storeId, input.storeId), gt(products.id, input.id)),
    orderBy: asc(products.id),
  })

  if (!product) {
    throw new Error("Product not found")
  }

  return product.id
}

export async function getPreviousProductIdAction(
  input: z.infer<typeof getProductSchema>
) {
  if (typeof input.storeId !== "number" || typeof input.id !== "number") {
    throw new Error("Invalid input")
  }

  const product = await db.query.products.findFirst({
    where: and(eq(products.storeId, input.storeId), lt(products.id, input.id)),
    orderBy: desc(products.id),
  })

  if (!product) {
    throw new Error("Product not found")
  }

  return product.id
}
