"use client"

import { useState } from "react"
import type { CartLineItem, EasyPostAddress, StripeAddress, Dimensions } from "@/types"

export const transformAddress = (
  address: StripeAddress,
  additionalFields?: object
): EasyPostAddress => {
  const {
    line1: street1,
    line2: street2,
    postal_code: zip,
    ...restOfAddressData
  } = address
  const transformedAddress = {
    street1,
    zip,
    ...restOfAddressData,
    ...additionalFields,
  } as EasyPostAddress
  if (street2) transformedAddress.street2 = street2
  return transformedAddress
}

export function useShipping(cartLineItems: CartLineItem[]) {
  const [rate, setRate] = useState<number>(0)

  const total = cartLineItems.reduce(
    (total, item) => total + item.quantity * Number(item.price),
    0
  )

  return { rate, setRate, total }
}

export function getDimensions(cartLineItems: CartLineItem[]) {
  // TODO: Add support for dimension packing algorithm to calculate shipping rates
  const dimensions = cartLineItems.reduce(
    (dimensions, item) => {
      const { width, height, length, weight } = item
      if (width) dimensions.width += Number(width)
      if (height) dimensions.height += Number(height)
      if (length) dimensions.length += Number(length)
      if (weight) dimensions.weight += Number(weight)
      return dimensions
    },
    {
      width: 10,
      height: 10,
      length: 10,
      weight: 10,
    }
  ) as Dimensions
  return dimensions
}
