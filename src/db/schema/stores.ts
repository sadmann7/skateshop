import { createId, pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { boolean, text, timestamp, varchar } from "drizzle-orm/pg-core"

import { payments } from "./payments"
import { products } from "./products"

export const stores = pgTable("stores", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  userId: varchar("user_id", { length: 36 }), // uuid v4
  name: varchar("name").notNull(),
  description: text("description"),
  slug: text("slug").unique(),
  active: boolean("active").notNull().default(false),
  stripeAccountId: varchar("stripe_account_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  payments: many(payments),
}))

export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert
