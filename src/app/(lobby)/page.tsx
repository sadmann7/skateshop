import * as React from "react"

import { getGithubStars } from "@/lib/actions/github"
import { getFeaturedProducts } from "@/lib/actions/product"
import { getFeaturedStores } from "@/lib/actions/store"

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
