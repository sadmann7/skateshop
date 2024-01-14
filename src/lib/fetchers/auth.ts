import "server-only"

import { currentUser } from "@clerk/nextjs"

export async function getCacheduser() {
  try {
    return currentUser()
  } catch (err) {
    console.error(err)
    return null
  }
}
