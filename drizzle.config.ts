import { env } from "@/env.js"
import type { Config } from "drizzle-kit"

import { databasePrefix } from "@/lib/constants"

export default {
  schema: "./src/db/schema.ts",
  driver: "mysql2",
  out: "./drizzle",
  dbCredentials: {
    uri: env.DATABASE_URL,
  },
  // tablesFilter: [`${databasePrefix}_*`],
} satisfies Config
