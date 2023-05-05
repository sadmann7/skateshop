"use server"

import { revalidateTag } from "next/cache"
import { zact } from "zact/server"
import { z } from "zod"

import { prisma } from "@/lib/db"
import { addStoreSchema } from "@/lib/validations/store"

export const addStoreAction = zact(
  z.object({
    ...addStoreSchema.shape,
    userId: z.string(),
  })
)(async (input) => {
  await prisma.store.create({
    data: {
      name: input.name,
      description: input.description,
      user: {
        connect: {
          id: input.userId,
        },
      },
    },
  })

  const tag = `stores:${input.userId}`
  revalidateTag(tag)
})
