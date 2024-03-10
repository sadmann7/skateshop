import { env } from "@/env.js"
import { type Config } from "drizzle-kit"

import { dbPrefix } from "@/lib/constants"

export default {
  schema: "./src/db/schema/index.ts",
  driver: "pg",
  out: "./drizzle",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: [`${dbPrefix}_*`],
} satisfies Config
