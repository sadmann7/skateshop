"use server"

import { revalidatePath } from "next/cache"
import { clerkClient } from "@clerk/nextjs"
import type { z } from "zod"

import { prisma } from "@/lib/db"
import { type addStoreSchema } from "@/lib/validations/store"

export async function addStoreAction(
  input: z.infer<typeof addStoreSchema> & { userId: string }
) {
  const { name, description, userId } = input

  const user = await clerkClient.users.getUser(userId)

  if (!user) {
    throw new Error("User not found")
  }

  // If the user doesn't have a role, set it to user
  if (!user.privateMetadata.role) {
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        role: "user",
      },
    })
  }

  const storeWithSameName = await prisma.store.findFirst({
    where: {
      name,
    },
  })

  if (storeWithSameName) {
    throw new Error("Store name already taken")
  }

  await prisma.store.create({
    data: {
      name,
      description,
      userId,
    },
  })

  revalidatePath("/account/stores")
}
