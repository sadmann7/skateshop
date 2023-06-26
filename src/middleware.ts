import { authMiddleware } from "@clerk/nextjs/server"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/signin(.*)",
    "/signup(.*)",
    "/sso-callback(.*)",
    "/api(.*)",
    "/categories(.*)",
    "/products(.*)",
    "/build-a-board(.*)",
  ],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
}
