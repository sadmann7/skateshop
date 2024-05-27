import { revalidatePath } from "next/cache"
import { env } from "@/env"

export async function GET() {
  if (env.NODE_ENV !== "development") {
    return Response.json({ message: "Not allowed" }, { status: 403 })
  }

  revalidatePath("/")

  return new Response("revalidated everything", { status: 200 })
}
