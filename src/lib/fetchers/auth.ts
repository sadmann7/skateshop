import "server-only"

import { unstable_cache as cache } from "next/cache"
import { currentUser } from "@clerk/nextjs"

export async function getCacheduser() {
  try {
    return await cache(
      async () => {
        return currentUser()
      },
      ["cached-user"],
      {
        revalidate: 900,
        tags: ["cached-user"],
      }
    )()
  } catch (err) {
    console.error(err)
    return null
  }
}
