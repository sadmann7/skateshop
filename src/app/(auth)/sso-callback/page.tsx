"use client"

import * as React from "react"
import { useClerk } from "@clerk/nextjs"
import type { HandleOAuthCallbackParams } from "@clerk/types"

import { Icons } from "@/components/icons"

export const runtime = "edge"

interface SSOCallbackProps {
  searchParams: HandleOAuthCallbackParams
}

export default function SSOCallbackPage({ searchParams }: SSOCallbackProps) {
  const { handleRedirectCallback } = useClerk()

  React.useEffect(() => {
    void handleRedirectCallback(searchParams)
  }, [searchParams, handleRedirectCallback])

  return (
    <div className="flex items-center justify-center">
      <Icons.spinner className="mr-2 h-16 w-16 animate-spin" />
    </div>
  )
}
