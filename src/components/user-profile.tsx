"use client"

import { UserProfile as ClerkUserProfile } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { type Theme } from "@clerk/types"
import { useTheme } from "next-themes"

const appearance: Theme = {
  baseTheme: undefined,
  variables: {
    borderRadius: "0.25rem",
  },
  elements: {
    card: "shadow-none",
    navbar: "hidden",
    navbarMobileMenuButton: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
  },
}

export function UserProfile() {
  const { theme } = useTheme()

  return (
    <ClerkUserProfile
      appearance={{
        ...appearance,
        baseTheme: theme === "dark" ? dark : appearance.baseTheme,
        variables: {
          ...appearance.variables,
          colorBackground: theme === "light" ? "#fafafa" : undefined,
        },
      }}
    />
  )
}
