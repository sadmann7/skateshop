import { relations } from "drizzle-orm"
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { generateId } from "@/lib/id"

import { customers } from "./customers"
import { payments } from "./payments"
import { products } from "./products"
import { tags } from "./tags"
import { lifecycleDates } from "./utils"
import { variants } from "./variants"

export const storePlanEnum = pgEnum("store_plan", ["free", "standard", "pro"])

export const stores = pgTable("stores", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => generateId())
    .primaryKey(), // prefix_ + nanoid (12)
  userId: varchar("user_id", { length: 36 }).notNull(), // uuid v4
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),

  plan: storePlanEnum("plan").notNull().default("free"),
  planEndsAt: timestamp("ends_at"),
  cancelPlanAtEnd: boolean("cancel_plan_at_end").default(false),
  stripeAccountId: varchar("stripe_account_id").unique(), // stripe connect
  stripeCustomerId: varchar("stripe_customer_id").unique(),
  productLimit: integer("product_limit").notNull().default(10),
  tagLimit: integer("tag_limit").notNull().default(5),
  variantLimit: integer("variant_limit").notNull().default(5),
  ...lifecycleDates,
})

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products, { relationName: "storeProducts" }),
  payments: many(payments, { relationName: "storePayments" }),
  customers: many(customers, { relationName: "storeCustomers" }),
  tags: many(tags, { relationName: "storeTags" }),
  variants: many(variants, { relationName: "storeVariants" }),
}))

export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert
