import * as React from "react"

import { getGithubStars } from "@/lib/actions/github"
import { getCategories, getFeaturedProducts } from "@/lib/actions/product"
import { getFeaturedStores } from "@/lib/actions/store"

import { Lobby } from "./_components/lobby"
import { LobbySkeleton } from "./_components/lobby-skeleton"

export default function IndexPage() {
  /**
   * To avoid sequential waterfall requests, multiple promises are passed to fetch data parallelly.
   * These promises are also passed to the `Lobby` component, making them hot promises. This means they can execute without being awaited, further preventing sequential requests.
   * @see https://www.youtube.com/shorts/A7GGjutZxrs
   * @see https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
   */
  const githubStarsPromise = getGithubStars()
  const productsPromise = getFeaturedProducts()
  const categoriesPromise = getCategories()
  const storesPromise = getFeaturedStores()

  return (
    <React.Suspense fallback={<LobbySkeleton />}>
      <Lobby
        githubStarsPromise={githubStarsPromise}
        productsPromise={productsPromise}
        categoriesPromise={categoriesPromise}
        storesPromise={storesPromise}
      />
    </React.Suspense>
  )
}
