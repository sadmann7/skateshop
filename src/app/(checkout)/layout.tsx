import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"

interface CheckoutLayoutProps {
  children: React.ReactNode
}

export default async function CheckoutLayout({
  children,
}: CheckoutLayoutProps) {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  return <>{children}</>
}
