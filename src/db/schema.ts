import { sql } from "drizzle-orm"
import {
  datetime,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  varchar,
} from "drizzle-orm/mysql-core"

export const product = mysqlTable(
  "Product",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    description: text("description"),
    price: int("price").notNull(),
    category: mysqlEnum("category", [
      "SKATEBOARD",
      "CLOTHING",
      "SHOES",
      "ACCESSORIES",
    ])
      .default("SKATEBOARD")
      .notNull(),
    quantity: int("quantity").default(1).notNull(),
    inventory: int("inventory").default(1).notNull(),
    rating: int("rating").default(0).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    storeId: varchar("storeId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      storeIdIdx: index("Product_storeId_idx").on(table.storeId),
    }
  }
)

export const productImage = mysqlTable(
  "ProductImage",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    url: varchar("url", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
    productId: varchar("productId", { length: 191 }),
  },
  (table) => {
    return {
      productIdIdx: index("ProductImage_productId_idx").on(table.productId),
    }
  }
)

export const store = mysqlTable(
  "Store",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    description: text("description"),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("Store_userId_idx").on(table.userId),
    }
  }
)
