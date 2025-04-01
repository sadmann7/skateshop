import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";

import { Onboarding } from "./components/onboarding";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Get started with your new store",
};

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/signin");
  }

  return (
    <Shell>
      <Onboarding userId={userId} />
    </Shell>
  );
}
