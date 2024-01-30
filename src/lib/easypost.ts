import { env } from "@/env.mjs"
import EasyPost from "@easypost/api"

export const easypost = new EasyPost(env.EASYPOST_API_KEY)
