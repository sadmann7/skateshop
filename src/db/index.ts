import { env } from "@/env.js"
import { Client } from "@planetscale/database"
import { drizzle } from "drizzle-orm/planetscale-serverless"

import * as schema from "./schema"

// create the connection
const client = new Client({
  url: env.DATABASE_URL,
})
export const db = drizzle(client, { schema })
