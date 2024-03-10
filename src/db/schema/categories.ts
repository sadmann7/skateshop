import { createId, pgTable } from "@/db/utils"
import { relations, sql } from "drizzle-orm"
import { text, timestamp, varchar } from "drizzle-orm/pg-core"

import { products } from "./products"
import { subcategories } from "./subcategories"

export const categories = pgTable("categories", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  slug: varchar("slug", { length: 256 }).unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  subcategories: many(subcategories),
}))

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
