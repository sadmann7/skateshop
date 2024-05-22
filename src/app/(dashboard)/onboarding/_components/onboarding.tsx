// @see https://github.com/juliusmarminge/acme-corp/blob/main/apps/nextjs/src/app/(dashboard)/onboarding/multi-step-form.tsx

"use client"

import { useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"

import { ConnectStripe } from "./connect-stripe"
import { CreateStore } from "./create-store"
import { Intro } from "./intro"

interface OnboardingProps {
  userId: string
}

export function Onboarding({ userId }: OnboardingProps) {
  const search = useSearchParams()
  const step = search.get("step")
  const storeId = search.get("store")

  return (
    <div className="mx-auto flex h-[calc(100vh-14rem)] w-full max-w-screen-sm flex-col items-center">
      <AnimatePresence mode="wait">
        {!step && <Intro key="intro" />}
        {step === "create" && <CreateStore userId={userId} />}
        {step === "connect" && <ConnectStripe storeId={storeId} />}
      </AnimatePresence>
    </div>
  )
}
