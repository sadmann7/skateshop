import { pgTableCreator } from "drizzle-orm/pg-core"
import { customAlphabet } from "nanoid"

import { dbPrefix } from "@/lib/constants"

export function createId(length = 16) {
  return customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length
  )()
}

/**
 * This lets us use the multi-project schema feature of Drizzle ORM. So the same
 * database instance can be used for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `${dbPrefix}_${name}`)
