"use server"

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
  revalidatePath,
} from "next/cache"
import { db } from "@/db"
import {
  categories,
  products,
  stores,
  subcategories,
  type Product,
} from "@/db/schema"
import type { SearchParams, StoredFile } from "@/types"
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  inArray,
  lte,
  not,
  sql,
} from "drizzle-orm"
import { type z } from "zod"

import { getErrorMessage } from "@/lib/handle-error"
import {
  getProductsSchema,
  type addProductSchema,
  type updateProductRatingSchema,
} from "@/lib/validations/product"

// See the unstable_cache API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_cache
export async function getFeaturedProducts() {
  return await cache(
    async () => {
      return db
        .select({
          id: products.id,
          name: products.name,
          images: products.images,
          category: categories.name,
          price: products.price,
          inventory: products.inventory,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(products)
        .limit(8)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .groupBy(products.id, stores.stripeAccountId, categories.name)
        .orderBy(
          desc(count(stores.stripeAccountId)),
          desc(count(products.images)),
          desc(products.createdAt)
        )
    },
    ["featured-products"],
    {
      revalidate: 3600, // every hour
      tags: ["featured-products"],
    }
  )()
}

// See the unstable_noStore API docs: https://nextjs.org/docs/app/api-reference/functions/unstable_noStore
export async function getProducts(input: SearchParams) {
  noStore()

  try {
    const search = getProductsSchema.parse(input)

    const limit = search.per_page
    const offset = (search.page - 1) * limit

    const [column, order] = (search.sort?.split(".") as [
      keyof Product | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["createdAt", "desc"]
    const [minPrice, maxPrice] = search.price_range?.split("-") ?? []
    const categoryIds = search.categories?.split(".") ?? []
    const subcategoryIds = search.subcategories?.split(".") ?? []
    const storeIds = search.store_ids?.split(".") ?? []

    const transaction = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          images: products.images,
          category: categories.name,
          subcategory: subcategories.name,
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
        .limit(limit)
        .offset(offset)
        .leftJoin(stores, eq(products.storeId, stores.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
        .where(
          and(
            categoryIds.length > 0
              ? inArray(products.categoryId, categoryIds)
              : undefined,
            subcategoryIds.length > 0
              ? inArray(products.subcategoryId, subcategoryIds)
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

      const total = await tx
        .select({
          count: count(products.id),
        })
        .from(products)
        .where(
          and(
            categoryIds.length > 0
              ? inArray(products.categoryId, categoryIds)
              : undefined,
            subcategoryIds.length > 0
              ? inArray(products.subcategoryId, subcategoryIds)
              : undefined,
            minPrice ? gte(products.price, minPrice) : undefined,
            maxPrice ? lte(products.price, maxPrice) : undefined,
            storeIds.length ? inArray(products.storeId, storeIds) : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      const pageCount = Math.ceil(total / limit)

      return {
        data,
        pageCount,
      }
    })

    return transaction
  } catch (err) {
    return {
      data: [],
      pageCount: 0,
    }
  }
}

export async function getProductCount({ categoryId }: { categoryId: string }) {
  noStore()

  try {
    const total = await db
      .select({
        count: count(products.id),
      })
      .from(products)
      .where(eq(products.categoryId, categoryId))
      .execute()
      .then((res) => res[0]?.count ?? 0)

    return {
      data: {
        count: total,
      },
      error: null,
    }
  } catch (err) {
    return {
      data: {
        count: 0,
      },
      error: getErrorMessage(err),
    }
  }
}

export async function getCategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(categories)
        .orderBy(desc(categories.name))
    },
    ["categories"],
    {
      revalidate: 3600, // every hour
      tags: ["categories"],
    }
  )()
}

export async function getSubcategories() {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories)
    },
    ["subcategories"],
    {
      revalidate: 3600, // every hour
      tags: ["subcategories"],
    }
  )()
}

export async function getSubcategoriesByCategory({
  categoryId,
}: {
  categoryId: string
}) {
  return await cache(
    async () => {
      return db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories)
        .where(eq(subcategories.id, categoryId))
    },
    [`subcategories-${categoryId}`],
    {
      revalidate: 3600, // every hour
      tags: [`subcategories-${categoryId}`],
    }
  )()
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

    const categoriesWithProducts = await db.query.categories.findMany({
      columns: {
        id: true,
        name: true,
      },
      with: {
        products: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      // This doesn't do anything
      where: (table, { sql }) => sql`position(${query} in ${table.name}) > 0`,
    })

    return {
      data: categoriesWithProducts,
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

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
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

    revalidatePath(`/dashboard/stores/${input.storeId}/products.`)

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateProduct(
  input: z.infer<typeof addProductSchema> & { id: string; storeId: string }
) {
  try {
    const product = await db.query.products.findFirst({
      where: and(
        eq(products.id, input.id),
        eq(products.storeId, input.storeId)
      ),
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

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateProductRating(
  input: z.infer<typeof updateProductRatingSchema>
) {
  try {
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

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteProduct(input: { id: string; storeId: string }) {
  try {
    const product = await db.query.products.findFirst({
      columns: {
        id: true,
      },
      where: and(
        eq(products.id, input.id),
        eq(products.storeId, input.storeId)
      ),
    })

    if (!product) {
      throw new Error("Product not found.")
    }

    await db.delete(products).where(eq(products.id, input.id))

    revalidatePath(`/dashboard/stores/${input.storeId}/products`)

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
