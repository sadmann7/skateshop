import type { NextRequest } from "next/server"
import type { Prisma } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import * as z from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getProductsSchema } from "@/lib/validations/product"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return new Response("Unauthorized", { status: 403 })
    }

    const { user } = session

    // if (!user.seller) {
    //     return new Response("Forbidden", { status: 403 })
    // }

    const input = getProductsSchema.parse(await req.json())

    const params: Prisma.ProductFindManyArgs = {
      where: {
        storeId: input.storeId,
      },
    }

    const [count, products] = await prisma.$transaction([
      prisma.product.count({ where: params.where }),
      prisma.product.findMany({
        ...params,
        skip: input.page * input.perPage,
        take: input.perPage,
      }),
    ])

    return new Response(
      JSON.stringify({
        count,
        products,
      })
    )
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
