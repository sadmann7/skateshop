"use server"

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
  revalidatePath,
} from "next/cache"
import { db } from "@/db"
import { products, stores, type Product } from "@/db/schema"
import type { Category, StoredFile } from "@/types"
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  not,
  sql,
} from "drizzle-orm"
import { type z } from "zod"

import { getErrorMessage } from "@/lib/handle-error"
import type {
  addProductSchema,
  updateProductRatingSchema,
} from "@/lib/validations/product"
import { type getProductsSchema } from "@/lib/validations/product"

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
        revalidate: 1,
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
    const storeIds = input.store_ids?.split(".") ?? []

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
    const count = await db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(products)
      .where(eq(products.category, category.title))
      .execute()
      .then((res) => res[0]?.count ?? 0)

    return {
      data: count,
      error: null,
    }
  } catch (err) {
    return {
      data: 0,
      error: getErrorMessage(err),
    }
  }
}

export async function filterProducts({ query }: { query: string }) {
  noStore()

  try {
    if (query.length === 0) {
      return {
        data: null,
        error: null,
      }
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

    return {
      data: productsByCategory,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function checkProduct(input: { name: string; id?: string }) {
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
  input: z.infer<typeof addProductSchema> & { storeId: string }
) {
  try {
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
      images: JSON.stringify(input.images) as unknown as StoredFile[],
    })

    return revalidatePath(`/dashboard/stores/${input.storeId}/products.`)
  } catch (err) {
    return {
      error: getErrorMessage(err),
    }
  }
}

export async function updateProduct(
  input: z.infer<typeof addProductSchema> & { id: string; storeId: string }
) {
  const product = await db.query.products.findFirst({
    where: and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
  })

  if (!product) {
    throw new Error("Product not found.")
  }

  await db
    .update(products)
    .set({
      ...input,
      images: JSON.stringify(input.images) as unknown as StoredFile[],
    })
    .where(eq(products.id, input.id))

  revalidatePath(`/dashboard/stores/${input.storeId}/products/${input.id}`)
}

export async function updateProductRating(
  input: z.infer<typeof updateProductRatingSchema>
) {
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

export async function deleteProduct(input: { id: string; storeId: string }) {
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
