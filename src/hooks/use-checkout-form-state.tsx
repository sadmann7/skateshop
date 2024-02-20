import { useEffect, useState, useTransition } from "react"

import type { StripeAddress } from "@/types/index"

interface FormState {
  email: string
  address: StripeAddress | undefined
  confirmed: boolean
}

function parseAddress(jsonString: string) {
  try {
    return JSON.parse(jsonString) as StripeAddress | undefined
  } catch (e) {
    console.error("Error parsing JSON:", e)
    return undefined
  }
}

function parseEmail(jsonString: string) {
  try {
    return JSON.parse(jsonString) as string
  } catch (e) {
    console.error("Error parsing JSON:", e)
    return ""
  }
}

function parseConfirmed(jsonString: string) {
  try {
    return JSON.parse(jsonString) as boolean
  } catch (e) {
    console.error("Error parsing JSON:", e)
    return false
  }
}

export function useCheckoutFormState(initialState: FormState) {
  // State declarations
  const [address, setAddress] = useState<StripeAddress | undefined>(() => {
    const savedAddress = localStorage.getItem("checkoutAddress")
    return savedAddress ? parseAddress(savedAddress) : initialState.address
  })

  const [email, setEmail] = useState<string>(() => {
    const savedEmail = localStorage.getItem("checkoutEmail")
    return savedEmail ? parseEmail(savedEmail) : initialState.email
  })

  const [confirmed, setConfirmed] = useState<boolean>(() => {
    const savedConfirmed = localStorage.getItem("confirmedState")
    return savedConfirmed !== null
      ? parseConfirmed(savedConfirmed)
      : initialState.confirmed
  })

  const [isLoading, setIsLoading] = useState(false)

  const [isPending, startTransition] = useTransition()

  // Effects for synchronization with local storage
  useEffect(() => {
    localStorage.setItem("checkoutEmail", JSON.stringify(email))
  }, [email])

  useEffect(() => {
    localStorage.setItem("checkoutAddress", JSON.stringify(address))
  }, [address])

  useEffect(() => {
    localStorage.setItem("confirmedState", JSON.stringify(confirmed))
  }, [confirmed])

  // Functions to update the states
  const updateEmail = (newEmail: string) => {
    setEmail(newEmail)
  }

  const updateAddress = (newAddress: StripeAddress | undefined) => {
    setAddress(newAddress)
  }

  const toggleConfirmed = (newConfirmed: boolean) => {
    setConfirmed(newConfirmed)
  }

  const updateLoading = (newLoading: boolean) => {
    setIsLoading(newLoading)
  }

  const clearForm: () => void = () => {
    localStorage.removeItem("confirmedState")
    localStorage.removeItem("checkoutEmail")
    localStorage.removeItem("checkoutAddress")
  }

  return {
    email,
    address,
    confirmed,
    isLoading,
    isPending,
    updateEmail,
    updateAddress,
    toggleConfirmed,
    updateLoading,
    startTransition,
    clearForm,
  }
}
