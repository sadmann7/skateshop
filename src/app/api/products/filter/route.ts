import type { NextRequest } from "next/server"
import type { GroupedProduct } from "@/types"
import { PRODUCT_CATEGORY, type Product } from "@prisma/client"
import * as z from "zod"

import { prisma } from "@/lib/db"
import { filterProductsSchema } from "@/lib/validations/product"

export async function POST(req: NextRequest) {
  try {
    const input = filterProductsSchema.parse(await req.json())

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: input.query,
        },
      },
      select: {
        id: true,
        name: true,
        category: true,
      },
    })

    const groupedProducts = Object.values(PRODUCT_CATEGORY).map((category) => ({
      category,
      products: products.filter((product) => product.category === category),
    })) satisfies GroupedProduct<Pick<Product, "id" | "name">>[]

    return new Response(JSON.stringify(groupedProducts), { status: 200 })
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
