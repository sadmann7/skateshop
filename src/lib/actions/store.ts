"use server"

import {
  unstable_cache as cache,
  unstable_noStore as noStore,
  revalidatePath,
  revalidateTag,
} from "next/cache"
import { db } from "@/db"
import { products, stores, type Store } from "@/db/schema"
import type { SearchParams } from "@/types"
import { and, asc, count, desc, eq, isNull, not, sql } from "drizzle-orm"
import { type z } from "zod"

import { getErrorMessage } from "@/lib/handle-error"
import { slugify } from "@/lib/utils"
import {
  getStoresSchema,
  updateStoreSchema,
  type addStoreSchema,
} from "@/lib/validations/store"

export async function getFeaturedStores() {
  return await cache(
    async () => {
      return db
        .select({
          id: stores.id,
          name: stores.name,
          description: stores.description,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(stores)
        .limit(4)
        .leftJoin(products, eq(products.storeId, stores.id))
        .groupBy(stores.id)
        .orderBy(desc(stores.active), desc(sql<number>`count(*)`))
    },
    ["featured-stores"],
    {
      revalidate: 3600, // every hour
      tags: ["featured-stores"],
    }
  )()
}

export async function getStoresByUserId(input: { userId: string }) {
  return await cache(
    async () => {
      return db
        .select({
          id: stores.id,
          name: stores.name,
          slug: stores.slug,
          description: stores.description,
          stripeAccountId: stores.stripeAccountId,
        })
        .from(stores)
        .leftJoin(products, eq(products.storeId, stores.id))
        .groupBy(stores.id)
        .orderBy(desc(stores.stripeAccountId), desc(sql<number>`count(*)`))
        .where(eq(stores.userId, input.userId))
    },
    [`stores-${input.userId}`],
    {
      revalidate: 900,
      tags: [`stores-${input.userId}`],
    }
  )()
}

export async function getStores(input: SearchParams) {
  noStore()
  try {
    const search = getStoresSchema.parse(input)

    const limit = search.per_page
    const offset = (search.page - 1) * limit
    const [column, order] =
      (search.sort?.split(".") as [
        keyof Store | undefined,
        "asc" | "desc" | undefined,
      ]) ?? []
    const statuses = search.statuses?.split(".") ?? []

    const { data, total } = await db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: stores.id,
          name: stores.name,
          description: stores.description,
          stripeAccountId: stores.stripeAccountId,
          productCount: count(products.id),
        })
        .from(stores)
        .limit(limit)
        .offset(offset)
        .leftJoin(products, eq(stores.id, products.storeId))
        .where(
          and(
            search.user_id ? eq(stores.userId, search.user_id) : undefined,
            statuses.includes("active") && !statuses.includes("inactive")
              ? not(isNull(stores.stripeAccountId))
              : undefined,
            statuses.includes("inactive") && !statuses.includes("active")
              ? isNull(stores.stripeAccountId)
              : undefined
          )
        )
        .groupBy(stores.id)
        .orderBy(
          input.sort === "stripeAccountId.asc"
            ? asc(stores.stripeAccountId)
            : input.sort === "stripeAccountId.desc"
              ? desc(stores.stripeAccountId)
              : input.sort === "productCount.asc"
                ? asc(sql<number>`count(*)`)
                : input.sort === "productCount.desc"
                  ? desc(sql<number>`count(*)`)
                  : column && column in stores
                    ? order === "asc"
                      ? asc(stores[column])
                      : desc(stores[column])
                    : desc(stores.createdAt)
        )

      const total = await tx
        .select({
          count: count(stores.id),
        })
        .from(stores)
        .where(
          and(
            search.user_id ? eq(stores.userId, search.user_id) : undefined,
            statuses.includes("active") && !statuses.includes("inactive")
              ? not(isNull(stores.stripeAccountId))
              : undefined,
            statuses.includes("inactive") && !statuses.includes("active")
              ? isNull(stores.stripeAccountId)
              : undefined
          )
        )
        .execute()
        .then((res) => res[0]?.count ?? 0)

      return {
        data,
        total,
      }
    })

    const pageCount = Math.ceil(total / limit)

    return {
      data,
      pageCount,
    }
  } catch (err) {
    console.error(err)
    return {
      data: [],
      pageCount: 0,
    }
  }
}

export async function addStore(
  input: z.infer<typeof addStoreSchema> & { userId: string }
) {
  noStore()
  try {
    const storeWithSameName = await db.query.stores.findFirst({
      where: eq(stores.name, input.name),
    })

    if (storeWithSameName) {
      throw new Error("Store name already taken.")
    }

    const newStore = await db
      .insert(stores)
      .values({
        name: input.name,
        description: input.description,
        userId: input.userId,
        slug: slugify(input.name),
      })
      .returning({
        id: stores.id,
        slug: stores.slug,
      })
      .then((res) => res[0])

    revalidateTag(`stores-${input.userId}`)

    return {
      data: newStore,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateStore(storeId: string, fd: FormData) {
  noStore()
  try {
    const input = updateStoreSchema.parse({
      name: fd.get("name"),
      description: fd.get("description"),
    })

    const storeWithSameName = await db.query.stores.findFirst({
      where: and(eq(stores.name, input.name), not(eq(stores.id, storeId))),
      columns: {
        id: true,
      },
    })

    if (storeWithSameName) {
      throw new Error("Store name already taken")
    }

    await db
      .update(stores)
      .set({
        name: input.name,
        description: input.description,
      })
      .where(eq(stores.id, storeId))

    revalidateTag("user-stores")
    revalidatePath(`/dashboard/stores/${storeId}`)

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

export async function deleteStore(storeId: string) {
  noStore()
  try {
    const store = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
      columns: {
        id: true,
      },
    })

    if (!store) {
      throw new Error("Store not found")
    }

    await db.delete(stores).where(eq(stores.id, storeId))

    // Delete all products of this store
    await db.delete(products).where(eq(products.storeId, storeId))

    const path = "/dashboard/stores"
    revalidatePath(path)

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
