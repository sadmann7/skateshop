import "server-only"

import { unstable_cache as cache } from "next/cache"

export async function getGithubStars() {
  return await cache(
    async () => {
      const response = await fetch(
        "https://api.github.com/repos/sadmann7/skateshop",
        {
          headers: {
            Accept: "application/vnd.github+json",
          },
          next: {
            revalidate: 60,
          },
        }
      )

      if (!response.ok) {
        return null
      }

      const data = (await response.json()) as { stargazers_count: number }

      return data.stargazers_count
    },
    ["github-stars"],
    {
      revalidate: 900,
      tags: ["github-stars"],
    }
  )()
}
