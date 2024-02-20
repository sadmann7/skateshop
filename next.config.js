// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withContentlayer } = require("next-contentlayer")

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import("./src/env.mjs")

// Work around because EasyPost introduces hexoid error related to FormidableJs
// Discussed here: https://github.com/auth0/node-auth0/issues/657#issuecomment-928083729
/**
 * @param {import("webpack").Configuration} config
 */
function applyCustomWebpackConfig(config) {
  config.resolve = config.resolve || {}
  config.resolve.alias = config.resolve.alias || {}

  const aliases = {
    'formidable': false,
    'coffee-script': false,
    'vm2': false,
    'yargs': false,
    'colors': false,
    'keyv': false
  }

  Object.assign(config.resolve.alias, aliases)

  return config
}

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["tsx", "mdx", "ts", "js"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    // ppr: true,
    esmExternals: "loose",
  },
  // Already doing linting and typechecking as separate tasks in CI
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Work around because EasyPost introduces hexoid error related to FormidableJs
  /**
 * @param {import("webpack").Configuration} config
 */
  webpack: (config) => {
    // Apply custom Webpack configurations
    return applyCustomWebpackConfig(config)
  }
}

module.exports = withContentlayer(nextConfig)

