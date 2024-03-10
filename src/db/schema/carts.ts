import { createId, pgTable } from "@/db/utils"
import type { CartItem } from "@/types"
import { sql } from "drizzle-orm"
import { boolean, json, timestamp, varchar } from "drizzle-orm/pg-core"

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const carts = pgTable("carts", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  paymentIntentId: varchar("payment_intent_id", { length: 256 }),
  clientSecret: varchar("client_secret", { length: 256 }),
  items: json("items").$type<CartItem[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert
