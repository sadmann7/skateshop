import { type MetadataRoute } from "next"
import { allPosts } from "contentlayer/generated"

import { productCategories } from "@/config/products"
import { absoluteUrl } from "@/lib/utils"
import { getProductsAction } from "@/app/_actions/product"
import { getStoresAction } from "@/app/_actions/store"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const storesTransaction = await getStoresAction({
    limit: 10,
    offset: 0,
    sort: "createdAt.desc",
  })

  const stores = storesTransaction.items.map((store) => ({
    url: absoluteUrl(`/products?store_ids=${store.id}`),
    lastModified: new Date().toISOString(),
  }))

  const productsTransaction = await getProductsAction({
    limit: 10,
    offset: 0,
    sort: "createdAt.desc",
  })

  const products = productsTransaction.items.map((product) => ({
    url: absoluteUrl(`/product/${product.id}`),
    lastModified: new Date().toISOString(),
  }))

  const categories = productCategories.map((category) => ({
    url: absoluteUrl(`/categories/${category.title}`),
    lastModified: new Date().toISOString(),
  }))

  const subcategories = productCategories
    .map((category) =>
      category.subcategories.map((subcategory) => ({
        url: absoluteUrl(`/categories/${category.title}/${subcategory.slug}`),
        lastModified: new Date().toISOString(),
      }))
    )
    .flat()

  const posts = allPosts.map((post) => ({
    url: absoluteUrl(`${post.slug}`),
    lastModified: new Date().toISOString(),
  }))

  const routes = [
    "",
    "/products",
    "/stores",
    "/build-a-board",
    "/blog",
    "/dashboard/account",
    "/dashboard/billing",
    "/dashboard/purchases",
    "/dashboard/stores",
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString(),
  }))

  return [
    ...routes,
    ...stores,
    ...products,
    ...categories,
    ...subcategories,
    ...posts,
  ]
}
