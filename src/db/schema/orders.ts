import { createId, pgTable } from "@/db/utils"
import type { CheckoutItem } from "@/types"
import { sql } from "drizzle-orm"
import {
  decimal,
  index,
  integer,
  json,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { dbPrefix } from "@/lib/constants"

import { addresses } from "./addresses"
import { stores } from "./stores"

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const orders = pgTable(
  "orders",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => createId())
      .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    items: json("items").$type<CheckoutItem[] | null>().default(null),
    quantity: integer("quantity"),
    amount: decimal("amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", {
      length: 256,
    }).notNull(),
    stripePaymentIntentStatus: varchar("stripe_payment_intent_status", {
      length: 256,
    }).notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    email: varchar("email", { length: 256 }).notNull(),
    addressId: varchar("address_id", { length: 30 })
      .references(() => addresses.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  },
  (table) => ({
    storeIdIdx: index(`${dbPrefix}_orders_store_id_idx`).on(table.storeId),
    addressIdIdx: index(`${dbPrefix}_orders_address_id_idx`).on(
      table.addressId
    ),
  })
)

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
