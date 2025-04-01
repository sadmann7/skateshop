import { redirect } from "next/navigation";
import type * as React from "react";

import { SiteHeader } from "@/components/layouts/site-header";
import { getCachedUser } from "@/lib/queries/user";

export default async function CartLayout({
  children,
}: React.PropsWithChildren) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
