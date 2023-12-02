import { ImageResponse } from "next/og"

import { ogImageSchema } from "@/lib/validations/og"

export const runtime = "edge"

const calSemiBold = fetch(
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url)
).then((res) => res.arrayBuffer())

export function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const parsedValues = ogImageSchema.parse(
      Object.fromEntries(url.searchParams)
    )

    const { mode, title, description, type } = parsedValues
    const paint = mode === "dark" ? "#fff" : "#000"

    return new ImageResponse(
      (
        <div
          tw="flex h-full w-full flex-col items-center justify-center"
          style={{
            color: paint,
            background:
              mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
          }}
        >
          <div
            tw="mt-10 flex max-w-4xl flex-col items-center justify-center"
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {type ? (
              <div tw="px-8 text-xl font-medium uppercase leading-tight tracking-tight dark:text-zinc-50">
                {type}
              </div>
            ) : null}
            <div tw="px-8 text-5xl font-bold leading-tight tracking-tight dark:text-zinc-50">
              {title}
            </div>
            {description ? (
              <div tw="mt-5 px-20 text-center text-3xl font-normal leading-tight tracking-tight text-zinc-400">
                {description}
              </div>
            ) : null}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
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
