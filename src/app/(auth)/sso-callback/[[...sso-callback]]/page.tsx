import { AuthenticateWithRedirectCallback } from "@clerk/nextjs"

import { Icons } from "@/components/icons"
import { Shell } from "@/components/shell"
import { redirect } from "next/navigation";
import { getCachedUser } from "@/lib/queries/user";

export default async function SSOCallbackPage() {
  const user = await getCachedUser();

  if (user) {
    redirect("/");
  }
  
  return (
    <Shell className="max-w-lg place-items-center">
      <Icons.spinner className="size-16 animate-spin" aria-hidden="true" />
      <AuthenticateWithRedirectCallback />
    </Shell>
  )
}
