import * as React from "react"

import { getGithubStars } from "@/lib/actions/github"
import { getCategories, getFeaturedProducts } from "@/lib/actions/product"
import { getFeaturedStores } from "@/lib/actions/store"

import { Lobby } from "./_components/lobby"
import { LobbySkeleton } from "./_components/lobby-skeleton"

export default function IndexPage() {
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
