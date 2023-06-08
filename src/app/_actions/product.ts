"use server"

import { revalidateTag } from "next/cache"
import { db } from "@/db"
import { products } from "@/db/schema"
import type { StoredFile } from "@/types"
import { and, desc, eq, like, not } from "drizzle-orm"
import { type z } from "zod"

import { type productSchema } from "@/lib/validations/product"

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

export async function checkProductAction(name: string, id?: number) {
  if (typeof name !== "string") {
    throw new Error("Invalid input")
  }

  const productWithSameName = await db.query.products.findFirst({
    where: id
      ? and(not(eq(products.id, id)), eq(products.name, name))
      : eq(products.name, name),
  })

  if (productWithSameName) {
    throw new Error("Product name already taken")
  }
}

export async function addProductAction(
  input: z.infer<typeof productSchema> & {
    storeId: number
    images?: StoredFile[]
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

  revalidateTag("products")
}

export async function updateProductAction(
  input: z.infer<typeof productSchema> & { id: number; images?: StoredFile[] }
) {
  if (typeof input.id !== "number") {
    throw new Error("Id must be a number")
  }

  const product = await db.query.products.findFirst({
    where: eq(products.id, input.id),
  })

  if (!product) {
    throw new Error("Product not found")
  }

  await db.update(products).set(input).where(eq(products.id, input.id))

  revalidateTag("products")
}

export async function deleteProductAction(id: number) {
  if (typeof id !== "number") {
    throw new Error("Id must be a number")
  }

  await db.delete(products).where(eq(products.id, id))

  revalidateTag("products")
}

export async function deleteProductsAction(ids: number[]) {
  if (!Array.isArray(ids)) {
    throw new Error("Ids must be an array")
  }

  if (ids.some((id) => typeof id !== "number")) {
    throw new Error("Product ids must be an array of numbers")
  }

  for (const id of ids) {
    await db.delete(products).where(eq(products.id, id))
  }

  revalidateTag("products")
}
