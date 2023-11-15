"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { db } from "@/db"
import { products, type Product } from "@/db/schema"
import { faker } from "@faker-js/faker"
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
import { z } from "zod"

import { getSubcategories, productTags } from "@/config/products"
import {
  getProductSchema,
  getProductsSchema,
  productSchema,
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

  const category =
    faker.helpers.shuffle(products.category.enumValues)[0] ?? "skateboards"

  const subcategories = getSubcategories(category)

  for (let i = 0; i < productCount; i++) {
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

  await db.insert(products).values(data)
}

export async function filterProductsAction(query: string) {
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
  rawInput: z.infer<typeof getProductsSchema>
) {
  try {
    noStore()

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

export async function checkProductAction(input: { name: string; id?: number }) {
  const productWithSameName = await db.query.products.findFirst({
    where: input.id
      ? and(not(eq(products.id, input.id)), eq(products.name, input.name))
      : eq(products.name, input.name),
  })

  if (productWithSameName) {
    throw new Error("Product name already taken.")
  }
}

const extendedProductSchema = productSchema.extend({
  storeId: z.number(),
  images: z
    .array(z.object({ id: z.string(), name: z.string(), url: z.string() }))
    .nullable(),
})

export async function addProductAction(
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

export async function updateProductAction(
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

export async function deleteProductAction(
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

export async function getNextProductIdAction(
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

export async function getPreviousProductIdAction(
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
