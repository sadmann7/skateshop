import { redirect } from "next/navigation"

import { getCachedUser } from "@/lib/queries/user"

export default async function CheckoutLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getCachedUser()

  if (!user) {
    redirect("/signin")
  }

  return <main>{children}</main>
}
