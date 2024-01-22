import * as React from "react"

import { getGithubStars } from "@/lib/fetchers/github"
import { getFeaturedProducts } from "@/lib/fetchers/product"
import { getFeaturedStores } from "@/lib/fetchers/store"

import { Lobby } from "./_components/lobby"
import { LobbySkeleton } from "./_components/lobby-skeleton"

export default function IndexPage() {
  const productsPromise = getFeaturedProducts()
  const storesPromise = getFeaturedStores()
  const githubStarsPromise = getGithubStars()

  return (
    <React.Suspense fallback={<LobbySkeleton />}>
      <Lobby {...{ githubStarsPromise, productsPromise, storesPromise }} />
    </React.Suspense>
  )
}
