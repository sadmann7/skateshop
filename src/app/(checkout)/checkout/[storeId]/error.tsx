"use client"

// Error components must be Client Components
import * as React from "react"

import { ErrorCard } from "@/components/cards/error-card"
import { Shell } from "@/components/shell"

export default function StoreCheckoutError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Shell variant="centered" className="max-w-md">
      <ErrorCard title={error.name} description={error.message} reset={reset} />
    </Shell>
  )
}
