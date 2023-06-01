"use server"

import { revalidateTag } from "next/cache"
import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { zact } from "zact/server"
import { z } from "zod"

import { addProductSchema } from "@/lib/validations/product"

export async function filterProductsAction(query: string) {
  if (typeof query !== "string") {
    throw new Error("Query must be a string")
  }

  const filteredProducts = await db.query.products.findMany({
    where: eq(products.name, query),
    columns: {
      id: true,
      name: true,
      category: true,
    },
  })

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

export async function checkProductAction(name: string) {
  if (typeof name !== "string") {
    throw new Error("Name must be a string")
  }

  const productWithSameName = await db.query.products.findFirst({
    where: eq(products.name, name),
  })

  if (productWithSameName) {
    throw new Error("Product name already taken")
  }
}

export const addProductAction = zact(
  z.object({
    ...addProductSchema.shape,
    storeId: z.string(),
    images: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          url: z.string(),
        })
      )
      .optional()
      .default([]),
  })
)(async (input) => {
  const productWithSameName = await db.query.products.findFirst({
    where: eq(products.name, input.name),
  })

  if (productWithSameName) {
    throw new Error("Product name already taken")
  }

  await db.insert(products).values({
    name: input.name,
    description: input.description,
    category: input.category,
    images: input.images,
    price: input.price,
    quantity: input.quantity,
    inventory: input.inventory,
    storeId: input.storeId,
  })
})

export async function deleteProductsAction(ids: number[]) {
  // check if ids are array of strings
  if (!Array.isArray(ids)) {
    throw new Error("Ids must be an array")
  }

  if (ids.some((id) => typeof id !== "string")) {
    throw new Error("Ids must be an array of strings")
  }

  for (const id of ids) {
    await db.delete(products).where(eq(products.id, id))
  }

  revalidateTag("products")
}
