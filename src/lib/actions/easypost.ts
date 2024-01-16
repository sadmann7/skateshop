"use server"

import type { GetRateProps } from "@/types"
import type { Address, Parcel } from "@easypost/api"
import { Shipment } from "@easypost/api"
import { z } from "zod"

import { easypost } from "@/lib/easypost"
import { ratesSchema } from "@/lib/validations/easypost"

interface ShipmentResponse {
  rate: number | null
  error: string
  ok: boolean
  status: number
}

export async function getShippingRate(input: GetRateProps): Promise<ShipmentResponse> {
  try {
    const data = ratesSchema.parse(input)

    // TODO: Update DB Schema to include store address and get from there
    const storeAddress = {
      company: "EasyPost",
      street1: "417 Montgomery Street",
      street2: "5th Floor",
      city: "San Francisco",
      state: "CA",
      zip: "94104",
      country: "US",
      phone: "415-528-7555",
    }

    // TODO: Once out of Beta this should become easypost.BetaRate.retrieveStatelessRates({...})
    const shipment = await easypost.Shipment.create({
      to_address: data.toAddress as Address,
      from_address: storeAddress as Address,
      parcel: data.dimensions as Parcel,
    })

    // handled the return like it was a response from a POST but can be changed
    return { rate: Number(shipment.lowestRate().list_rate), error: 'No Error', ok: true, status: 200 }
  } catch (err) {
    console.error(err)

    if (err instanceof z.ZodError) {
      return { rate: null, error: err.message, ok: false, status: 400 }
    }

    if (err instanceof Error && "statusCode" in err) {
      return { rate: null, error: err.message, ok: false, status: err.statusCode as number }
    }

    return { rate: null, error: "Something went wrong.", ok: false, status: 500 }
  }
}

