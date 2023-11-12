"use client"

import * as React from "react"
import { useClerk } from "@clerk/nextjs"

import { Icons } from "@/components/icons"
import { type SSOCallbackPageProps } from "@/app/(auth)/(protected-auth)/sso-callback/page"

export function SSOCallback({ searchParams }: SSOCallbackPageProps) {
  const { handleRedirectCallback } = useClerk()

  React.useEffect(() => {
    void handleRedirectCallback(searchParams)
  }, [searchParams, handleRedirectCallback])

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-describedby="loading-description"
      className="flex items-center justify-center"
    >
      <Icons.spinner className="h-16 w-16 animate-spin" aria-hidden="true" />
    </div>
  )
}
