"use server"

import { revalidateTag } from "next/cache"
import { PRODUCT_CATEGORY } from "@prisma/client"
import { zact } from "zact/server"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { addProductSchema } from "@/lib/validations/product"

export async function filterProductsAction(query: string) {
  if (typeof query !== "string") {
    throw new Error("Query must be a string")
  }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: query,
      },
    },
    select: {
      id: true,
      name: true,
      category: true,
    },
  })

  const productsByCategory = Object.values(PRODUCT_CATEGORY).map(
    (category) => ({
      category,
      products: products.filter((product) => product.category === category),
    })
  )

  return productsByCategory
}

export async function checkProductAction(name: string) {
  if (typeof name !== "string") {
    throw new Error("Name must be a string")
  }

  const productWithSameName = await prisma.product.findFirst({
    where: {
      name,
    },
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
  const productWithSameName = await prisma.product.findFirst({
    where: {
      name: input.name,
    },
  })

  if (productWithSameName) {
    throw new Error("Product name already taken")
  }

  await prisma.product.create({
    data: {
      name: input.name,
      description: input.description,
      category: input.category,
      price: input.price,
      quantity: input.quantity,
      inventory: input.inventory,
      images: {
        createMany: {
          data: input.images,
        },
      },
      store: {
        connect: {
          id: input.storeId,
        },
      },
    },
  })
})

export async function deleteProductsAction(ids: string[]) {
  // check if ids are array of strings
  if (!Array.isArray(ids)) {
    throw new Error("Ids must be an array")
  }

  await prisma.product.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  })

  revalidateTag("products")
}
