import { boolean, json, pgTable, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"
import { type CartItemSchema } from "@/lib/validations/cart"

import { lifecycleDates } from "./utils"

// @see: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const carts = pgTable("carts", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  paymentIntentId: varchar("payment_intent_id", { length: 256 }),
  clientSecret: varchar("client_secret", { length: 256 }),
  items: json("items").$type<CartItemSchema[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  ...lifecycleDates,
})

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert
