import { ImageResponse } from "next/og"

import { cn } from "@/lib/utils"
import { ogImageSchema } from "@/lib/validations/og"

export const runtime = "edge"

export async function GET(req: Request) {
  try {
    const calSemiBoldData = await fetch(
      new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer())
    const interData = await fetch(
      new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer())

    const url = new URL(req.url)
    const parsedValues = ogImageSchema.parse(
      Object.fromEntries(url.searchParams)
    )

    const { mode, title, description, type } = parsedValues

    return new ImageResponse(
      (
        <div
          tw="flex size-full flex-col items-center justify-center"
          style={{
            color: mode === "dark" ? "#fff" : "#000",
            background: mode === "dark" ? "#09090b" : "#ffffff",
          }}
        >
          <div
            tw="flex max-w-4xl flex-col items-center justify-center"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {type ? (
              <div tw="px-8 text-xl font-medium uppercase leading-tight tracking-tight">
                {type}
              </div>
            ) : null}
            <h1
              tw={cn(
                "px-8 text-6xl font-bold leading-tight tracking-tight",
                mode === "dark" ? "text-zinc-100" : "text-zinc-800"
              )}
              style={{
                fontFamily: "CalSans",
              }}
            >
              {title}
            </h1>
            {description ? (
              <p
                tw={cn(
                  "px-20 text-center text-3xl font-normal leading-tight tracking-tight",
                  mode === "dark" ? "text-zinc-400" : "text-zinc-500"
                )}
                style={{
                  fontFamily: "Inter",
                }}
              >
                {description}
              </p>
            ) : null}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "CalSans",
            data: calSemiBoldData,
            style: "normal",
          },
          {
            name: "Inter",
            data: interData,
            style: "normal",
          },
        ],
      }
    )
  } catch (error) {
    error instanceof Error
      ? console.log(`${error.message}`)
      : console.log(error)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
