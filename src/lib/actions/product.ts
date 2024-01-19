"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import { faker } from "@faker-js/faker"
import { and, desc, eq, like, not } from "drizzle-orm"
import { z } from "zod"

import { getSubcategories, productTags } from "@/config/products"
import {
  getProductSchema,
  productSchema,
  updateProductRatingSchema,
} from "@/lib/validations/product"

export async function seedProducts({
  storeId,
  count,
}: {
  storeId: number
  count?: number
}) {
  const productCount = count ?? 10

  const data: Product[] = []

  for (let i = 0; i < productCount; i++) {
    const category =
      faker.helpers.shuffle(products.category.enumValues)[0] ?? "skateboards"

    const subcategories = getSubcategories(category)

    data.push({
      id: new Date().getTime() + new Date().getMilliseconds() + i,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      images: Array.from({ length: 3 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.system.fileName(),
        url: faker.image.urlLoremFlickr({
          category,
          width: 640,
          height: 480,
        }),
      })),
      category,
      subcategory:
        faker.helpers.shuffle(subcategories)[0]?.value ??
        subcategories[0]?.value ??
        "decks",
      storeId,
      inventory: faker.number.float({ min: 50, max: 100 }),
      rating: faker.number.float({ min: 0, max: 5 }),
      tags: productTags.slice(0, faker.number.float({ min: 0, max: 5 })),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    })
  }

  await db.delete(products).where(eq(products.storeId, storeId))

  await db.insert(products).values(data)
}

const extendedProductSchema = productSchema.extend({
  storeId: z.number(),
  images: z
    .array(z.object({ id: z.string(), name: z.string(), url: z.string() }))
    .nullable(),
})

export async function filterProducts(query: string) {
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

export async function addProduct(
  rawInput: z.infer<typeof extendedProductSchema>
) {
  const input = extendedProductSchema.parse(rawInput)

  const productWithSameName = await db.query.products.findFirst({
    columns: {
      id: true,
    },
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

const extendedProductSchemaWithId = extendedProductSchema.extend({
  id: z.number(),
})

export async function updateProduct(
  input: z.infer<typeof extendedProductSchemaWithId>
) {
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
  })

  if (!product) {
    throw new Error("Product not found.")
  }

  await db.update(products).set(input).where(eq(products.id, input.id))

  revalidatePath(`/dashboard/stores/${input.storeId}/products/${input.id}`)
}

export async function updateProductRating(
  rawInput: z.infer<typeof updateProductRatingSchema>
) {
  const input = updateProductRatingSchema.parse(rawInput)

  const product = await db.query.products.findFirst({
    columns: {
      id: true,
      rating: true,
    },
    where: eq(products.id, input.id),
  })

  if (!product) {
    throw new Error("Product not found.")
  }

  await db
    .update(products)
    .set({ rating: input.rating })
    .where(eq(products.id, input.id))

  revalidatePath("/")
}

export async function deleteProduct(
  rawInput: z.infer<typeof getProductSchema>
) {
  const input = getProductSchema.parse(rawInput)

  const product = await db.query.products.findFirst({
    columns: {
      id: true,
    },
    where: and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
  })

  if (!product) {
    throw new Error("Product not found.")
  }

  await db.delete(products).where(eq(products.id, input.id))

  revalidatePath(`/dashboard/stores/${input.storeId}/products`)
}
