import { mysqlTableCreator } from "drizzle-orm/mysql-core"

import { databasePrefix } from "@/lib/constants"

export const mysqlTable = mysqlTableCreator(
  (name) => `${databasePrefix}_${name}`
)
