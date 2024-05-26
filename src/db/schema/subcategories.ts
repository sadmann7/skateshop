import { relations } from "drizzle-orm"
import { index, pgTable, text, varchar } from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { categories } from "./categories"
import { lifecycleDates } from "./utils"

export const subcategories = pgTable(
  "subcategories",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => generateId())
      .primaryKey(), // prefix_ + nanoid (12)
    name: text("name").notNull().unique(),
    slug: text("slug").unique().notNull(),
    description: text("description"),
    categoryId: varchar("category_id", { length: 30 })
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    ...lifecycleDates,
  },
  (table) => ({
    subcategoriesCategoryIdIdx: index("subcategories_category_id_idx").on(
      table.categoryId
    ),
  })
)

export const subcategoriesRelations = relations(subcategories, ({ one }) => ({
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id],
  }),
}))

export type Subcategory = typeof subcategories.$inferSelect
export type NewSubcategory = typeof subcategories.$inferInsert
