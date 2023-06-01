import type { NextRequest } from "next/server"
import { db } from "@/db"
import { stores } from "@/db/schema"
import { currentUser } from "@clerk/nextjs"
import { and, eq, not } from "drizzle-orm"
import * as z from "zod"

import { editStoreSchema } from "@/lib/validations/store"

export async function PATCH(req: NextRequest) {
  try {
    const user = await currentUser()

    if (!user) {
      return new Response("Unauthorized.", { status: 403 })
    }

    const input = editStoreSchema.parse(await req.json())

    const storeWithSameName = await db
      .select()
      .from(stores)
      .where(
        and(eq(stores.name, input.name), not(eq(stores.id, input.storeId)))
      )

    if (storeWithSameName) {
      return new Response("A store with the same name already exists.", {
        status: 409,
      })
    }

    const updatedStore = await db
      .update(stores)
      .set({
        name: input.name,
        description: input.description,
      })
      .where(eq(stores.id, input.storeId))

    return new Response(JSON.stringify(updatedStore), { status: 200 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    } else if (error instanceof Error) {
      return new Response(error.message, { status: 500 })
    } else {
      return new Response(null, { status: 500 })
    }
  }
}
