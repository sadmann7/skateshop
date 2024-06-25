"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ConnectStoreToStripeButton } from "@/components/connect-store-to-stripe-button"

import { StepHeader } from "./step-header"

interface ConnectStripeProps {
  storeId: string | null
}

export function ConnectStripe({ storeId }: ConnectStripeProps) {
  const router = useRouter()

  React.useEffect(() => {
    if (!storeId) {
      router.push("/onboarding")
    }
  }, [router, storeId])

  return (
    <motion.div
      className="flex size-full flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-6 rounded-xl bg-background/60 p-8"
      >
        <StepHeader
          title="Now let's connect your store to Stripe"
          description="Connect your store to Stripe to start accepting payments"
        />
        {storeId && (
          <motion.div
            className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
            variants={{
              hidden: { opacity: 0, x: 100 },
              show: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.4, type: "spring" },
              },
            }}
          >
            <ConnectStoreToStripeButton storeId={storeId} className="w-full" />
            <Button
              variant="outline"
              onClick={() => router.push(`/store/${storeId}`)}
              className="w-full"
            >
              Skip for now
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
