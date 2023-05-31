import { authMiddleware } from "@clerk/nextjs/server"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api(.*)",
    "/info(.*)",
    "/proxy(.*)",
  ],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
}
