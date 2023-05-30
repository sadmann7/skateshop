import { authMiddleware } from "@clerk/nextjs/server"

export default authMiddleware({
  publicRoutes: [
    "/",
    "/signin(.*)",
    "/sso-callback(.*)",
    "/terms(.*)",
    "/pricing(.*)",
    "/privacy(.*)",
    "/api(.*)",
  ],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
