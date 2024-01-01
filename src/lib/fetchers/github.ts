"use server"

export async function getGithubStars(): Promise<number | null> {
  try {
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
  } catch (err) {
    console.error(err)
    return null
  }
}

export type GithubStarsPromise = ReturnType<typeof getGithubStars>
