import { withContentlayer } from "next-contentlayer"
import plugin from 'next-intl/plugin'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs")

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["uploadthing.com"],
  },
  experimental: {
    serverActions: true,
  },
  /** Linting and typechecking are already done as separate tasks in the CI pipeline */
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
}

const withNextIntl = plugin("./src/i18n.ts");

export default withNextIntl(withContentlayer(nextConfig));