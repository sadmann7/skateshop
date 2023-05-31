import { type InferModel } from "drizzle-orm"
import {
  int,
  json,
  mysqlSchema,
  mysqlTable,
  serial,
  text,
} from "drizzle-orm/mysql-core"

export const mySchema = mysqlSchema("my_schema")

export const mySchemaUsers = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name"),
})

export const stores = mysqlTable("stores", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name"),
  description: text("description"),
  image: json("image"),
})

export type Store = InferModel<typeof stores>
