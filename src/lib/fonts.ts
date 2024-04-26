import localFont from "next/font/local"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

export const fontSans = GeistSans

export const fontMono = GeistMono

// Font files can be colocated inside of `pages`
export const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})
