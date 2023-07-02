import type { CartItem, StoredFile } from "@/types"
import { relations, type InferModel } from "drizzle-orm"
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

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 191 }).notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  slug: text("slug"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow(),
})

export type Store = InferModel<typeof stores>

export const storesRelations = relations(stores, ({ many }) => ({
  products: many(products),
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
  storeId: int("storeId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
})

export type Product = InferModel<typeof products>

export const productsRelations = relations(products, ({ one }) => ({
  store: one(stores, { fields: [products.storeId], references: [stores.id] }),
}))

export const carts = mysqlTable("carts", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 191 }),
  paymentIntentId: varchar("paymentIntentId", { length: 191 }),
  clientSecret: varchar("clientSecret", { length: 191 }),
  items: json("items").$type<CartItem[] | null>().default(null),
  createdAt: timestamp("createdAt").defaultNow(),
})

export type Cart = InferModel<typeof carts>

export const emailPreferences = mysqlTable("email_preferences", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 191 }),
  email: varchar("email", { length: 191 }).notNull(),
  token: varchar("token", { length: 191 }).notNull(),
  newsletter: boolean("newsletter").notNull().default(false),
  marketing: boolean("marketing").notNull().default(false),
  transactional: boolean("transactional").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
})

export type EmailPreference = InferModel<typeof emailPreferences>
