"use client"

// Error components must be Client Components
import * as React from "react"

import { ErrorCard } from "@/components/cards/error-card"

export default function UpdateStoreError({
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
    <ErrorCard
      title={error.name}
      description={error.message}
      reset={reset}
      className="mx-auto max-w-md pt-20"
    />
  )
}
