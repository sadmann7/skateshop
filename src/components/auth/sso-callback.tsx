"use client"

import * as React from "react"
import { useClerk } from "@clerk/nextjs"

import { Icons } from "@/components/icons"
import { type SSOCallbackPageProps } from "@/app/(auth)/sso-callback/page"

export default function SSOCallback({ searchParams }: SSOCallbackPageProps) {
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
