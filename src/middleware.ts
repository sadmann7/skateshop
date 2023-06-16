import { authMiddleware } from "@clerk/nextjs/server"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/signin(.*)",
    "/signup(.*)",
    "/api(.*)",
    "/categories(.*)",
    "/products(.*)",
  ],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
}
