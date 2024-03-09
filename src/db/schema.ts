import { createId, pgTable } from "@/db/utils"
import type { CartItem, CheckoutItem, StoredFile } from "@/types"
import { relations, sql } from "drizzle-orm"
import {
  boolean,
  decimal,
  index,
  integer,
  json,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { databasePrefix } from "@/lib/constants"

export const stores = pgTable("stores", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  userId: varchar("user_id", { length: 36 }).unique(), // uuid v4
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

export const categories = pgTable("categories", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
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

export const subcategories = pgTable(
  "subcategories",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => createId())
      .primaryKey(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    description: text("description"),
    categoryId: varchar("category_id", { length: 30 })
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  },
  (table) => ({
    subcategoriesCategoryIdIdx: index(
      `${databasePrefix}_subcategories_category_id_idx`
    ).on(table.categoryId),
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

export const products = pgTable(
  "products",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => createId())
      .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description"),
    images: json("images").$type<StoredFile[] | null>().default(null),
    categoryId: varchar("category_id", { length: 30 }).notNull(),
    subcategoryId: varchar("subcategory_id", { length: 30 }).references(
      () => subcategories.id,
      { onDelete: "cascade" }
    ),
    price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
    inventory: integer("inventory").notNull().default(0),
    rating: integer("rating").notNull().default(0),
    tags: json("tags").$type<string[] | null>().default(null),
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  },
  (table) => ({
    storeIdIdx: index(`${databasePrefix}_products_store_id_idx`).on(
      table.storeId
    ),
    categoryIdIdx: index(`${databasePrefix}_products_category_id_idx`).on(
      table.categoryId
    ),
    subcategoryIdIdx: index(`${databasePrefix}_products_subcategory_id_idx`).on(
      table.subcategoryId
    ),
  })
)

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategoryId],
    references: [subcategories.id],
  }),
}))

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

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

export const notifications = pgTable("notifications", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  userId: varchar("user_id", { length: 36 }).unique(), // uuid v4
  email: varchar("email", { length: 256 }).notNull().unique(),
  token: varchar("token", { length: 256 }).notNull().unique(),
  referredBy: varchar("referred_by", { length: 256 }),
  newsletter: boolean("newsletter").default(false).notNull(),
  marketing: boolean("marketing").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  userId: varchar("user_id", { length: 36 }).unique(), // uuid v4
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 256 }),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const payments = pgTable(
  "payments",
  {
    id: varchar("id", { length: 30 })
      .$defaultFn(() => createId())
      .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
    storeId: varchar("store_id", { length: 30 })
      .references(() => stores.id, { onDelete: "cascade" })
      .notNull(),
    stripeAccountId: varchar("stripe_account_id", { length: 256 }).notNull(),
    stripeAccountCreatedAt: integer("stripe_account_created_at"),
    stripeAccountExpiresAt: integer("stripe_account_expires_at"),
    detailsSubmitted: boolean("details_submitted").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
  },
  (table) => ({
    storeIdIdx: index(`${databasePrefix}_payments_store_id_idx`).on(
      table.storeId
    ),
  })
)

export const paymentsRelations = relations(payments, ({ one }) => ({
  store: one(stores, { fields: [payments.storeId], references: [stores.id] }),
}))

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert

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
    storeIdIdx: index(`${databasePrefix}_orders_store_id_idx`).on(
      table.storeId
    ),
    addressIdIdx: index(`${databasePrefix}_orders_address_id_idx`).on(
      table.addressId
    ),
  })
)

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const addresses = pgTable("addresses", {
  id: varchar("id", { length: 30 })
    .$defaultFn(() => createId())
    .primaryKey(), // prefix_ (if ocd kicks in) + nanoid (16)
  line1: varchar("line1", { length: 256 }),
  line2: varchar("line2", { length: 256 }),
  city: varchar("city", { length: 256 }),
  state: varchar("state", { length: 256 }),
  postalCode: varchar("postal_code", { length: 256 }),
  country: varchar("country", { length: 256 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").default(sql`current_timestamp`),
})

export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
