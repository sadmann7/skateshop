"use server"

import type { GetShippingRateProps, Dimensions } from "@/types"
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

export async function buyShippingLabel(shipment: Shipment) {
  // Buy postage label with the lowest rate
  const updatedShipment = await Shipment.buy(shipment.id, shipment.lowestRate())

  return updatedShipment.postage_label.label_url
}

// export async function createShipment(data: GetShippingRateProps) {
//   const fromAddress = await easypost.Address.createAndVerify(data.fromAddress)
//   const toAddress = await easypost.Address.createAndVerify(data.toAddress)
//   const parcel = await easypost.Parcel.create(data.dimensions)

//   const shipment = await Shipment.create({
//     to_address: fromAddress,
//     from_address: toAddress,
//     parcel: parcel,
//   })

//   return shipment
// }

export async function getShippingRate(input: GetShippingRateProps): Promise<ShipmentResponse> {
  try {
    const data = ratesSchema.parse(input)

    // const store = await db
    //   .select({
    //     street1: stores.street1,
    //     street2: stores.street2,
    //     city: stores.city,
    //     state: stores.state,
    //     zip: stores.zip,
    //     country: stores.country,
    //   })
    //   .from(stores)
    //   .where(eq(stores.id, data.storeId))
    //   .execute()
    //   .then((rows) => rows[0])

    // if (!store) {
    //   throw new Error("Store not found.")
    // }

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

    // TODO: THIS IS CURRENT ALSO A CLIENT FUNCTION IN use-shipping-rate-state.tsx
    // Both places need to be changed and maybe abstracted
    const dimensions = data.items.reduce(
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

    // TODO: Once out of Beta this should become easypost.BetaRate.retrieveStatelessRates({...})
    const shipment = await easypost.Shipment.create({
      to_address: data.toAddress as Address,
      from_address: storeAddress as Address,
      parcel: dimensions as Parcel,
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
