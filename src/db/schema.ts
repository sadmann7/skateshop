import type { CartItem, CheckoutItem, StoredFile } from "@/types"
import { relations } from "drizzle-orm"
import {
  boolean,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

import { createId } from "@/lib/utils"

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  slug: text("slug"),
  active: boolean("active").notNull().default(false),
  stripeAccountId: varchar("stripe_account_id", { length: 191 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
  payments: many(payments),
}))

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  images: json("images").$type<StoredFile[] | null>().default(null),
  category: mysqlEnum("category", [
    "skateboards",
    "clothing",
    "shoes",
    "accessories",
  ])
    .notNull()
    .default("skateboards"),
  subcategory: varchar("subcategory", { length: 191 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0"),
  inventory: int("inventory").notNull().default(0),
  rating: int("rating").notNull().default(0),
  tags: json("tags").$type<string[] | null>().default(null),
  storeId: int("store_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
}))

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const carts = mysqlTable("carts", {
  id: serial("id").primaryKey(),
  paymentIntentId: varchar("payment_intent_id", { length: 191 }),
  clientSecret: varchar("client_secret", { length: 191 }),
  items: json("items").$type<CartItem[] | null>().default(null),
  closed: boolean("closed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type Cart = typeof carts.$inferSelect
export type NewCart = typeof carts.$inferInsert

export const emailPreferences = mysqlTable("email_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 191 }),
  email: varchar("email", { length: 191 }).notNull(),
  token: varchar("token", { length: 191 }).notNull(),
  newsletter: boolean("newsletter").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  transactional: boolean("transactional").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type EmailPreference = typeof emailPreferences.$inferSelect
export type NewEmailPreference = typeof emailPreferences.$inferInsert

export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 128 })
    .$defaultFn(() => createId())
    .primaryKey(),
  userId: varchar("user_id", { length: 191 }).unique().notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 191 }),
  stripePriceId: varchar("stripe_price_id", { length: 191 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 191 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  storeId: int("storeId").notNull(),
  stripeAccountId: varchar("stripe_account_id", { length: 191 }).notNull(),
  stripeAccountCreatedAt: int("stripe_account_created_at"),
  stripeAccountExpiresAt: int("stripe_account_expires_at"),
  detailsSubmitted: boolean("details_submitted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert

export const paymentsRelations = relations(payments, ({ one }) => ({
  store: one(stores, { fields: [payments.storeId], references: [stores.id] }),
}))

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  storeId: int("store_id").notNull(),
  items: json("items").$type<CheckoutItem[] | null>().default(null),
  quantity: int("quantity"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull().default("0"),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", {
    length: 191,
  }).notNull(),
  stripePaymentIntentStatus: varchar("stripe_payment_intent_status", {
    length: 191,
  }).notNull(),
  name: varchar("name", { length: 191 }),
  email: varchar("email", { length: 191 }),
  addressId: int("address_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert

// Original source: https://github.com/jackblatch/OneStopShop/blob/main/db/schema.ts
export const addresses = mysqlTable("addresses", {
  id: serial("id").primaryKey(),
  line1: varchar("line1", { length: 191 }),
  line2: varchar("line2", { length: 191 }),
  city: varchar("city", { length: 191 }),
  state: varchar("state", { length: 191 }),
  postalCode: varchar("postal_code", { length: 191 }),
  country: varchar("country", { length: 191 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
})

export type Address = typeof addresses.$inferSelect
export type NewAddress = typeof addresses.$inferInsert
