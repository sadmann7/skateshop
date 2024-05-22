"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

import { ConnectStoreToStripeButton } from "@/components/connect-store-to-stripe-button"

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
        className="flex flex-col rounded-xl bg-background/60 p-8"
      >
        <motion.h1
          className="mb-4 text-balance text-2xl font-bold transition-colors sm:text-3xl"
          variants={{
            hidden: { opacity: 0, x: 250 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: "spring" },
            },
          }}
        >
          Now connect your store to Stripe
        </motion.h1>
        {storeId && (
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 100 },
              show: {
                opacity: 1,
                x: 0,
                transition: { duration: 0.4, type: "spring" },
              },
            }}
          >
            <ConnectStoreToStripeButton storeId={storeId} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
