import { type MetadataRoute } from "next"
import { allPosts } from "contentlayer/generated"

import { productCategories } from "@/config/products"
import { absoluteUrl } from "@/lib/utils"
import { getProductsAction } from "@/app/_actions/product"
import { getStoresAction } from "@/app/_actions/store"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const storesTransaction = await getStoresAction({
    limit: 50,
    offset: 0,
    sort: "createdAt.desc",
  })

  const storesRoutes = storesTransaction.items.map((store) => ({
    url: absoluteUrl(`/products?store_ids=${store.id}`),
    lastModified: new Date().toISOString(),
  }))

  const productsTransaction = await getProductsAction({
    limit: 50,
    offset: 0,
    sort: "createdAt.desc",
  })

  const productsRoutes = productsTransaction.items.map((product) => ({
    url: absoluteUrl(`/product/${product.id}`),
    lastModified: new Date().toISOString(),
  }))

  const categoriesRoutes = productCategories.map((category) => ({
    url: absoluteUrl(`/categories/${category.title}`),
    lastModified: new Date().toISOString(),
  }))

  const subcategoriesRoutes = productCategories
    .map((category) =>
      category.subcategories.map((subcategory) => ({
        url: absoluteUrl(`/categories/${category.title}/${subcategory.slug}`),
        lastModified: new Date().toISOString(),
      }))
    )
    .flat()

  const postsRoutes = allPosts.map((post) => ({
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
    "/dashboard/stores",
    "/dashboard/billing",
    "/dashboard/purchases",
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date().toISOString(),
  }))

  return [
    ...routes,
    ...storesRoutes,
    ...productsRoutes,
    ...categoriesRoutes,
    ...subcategoriesRoutes,
    ...postsRoutes,
  ]
}
