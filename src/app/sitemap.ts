import { type MetadataRoute } from "next"
import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { allPages, allPosts } from "contentlayer/generated"
import { count, desc, eq, sql } from "drizzle-orm"

import { getCategories, getSubcategories } from "@/lib/actions/product"
import { absoluteUrl } from "@/lib/utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allStores = await db
    .select({
      id: stores.id,
    })
    .from(stores)
    .leftJoin(products, eq(products.storeId, stores.id))
    .groupBy(stores.id)
    .orderBy(desc(stores.active), desc(sql<number>`count(*)`))

  const storesRoutes = allStores.map((store) => ({
    url: absoluteUrl(`/products?store_ids=${store.id}`),
    lastModified: new Date().toISOString(),
  }))

  const allProducts = await db
    .select({
      id: products.id,
    })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .groupBy(products.id)
    .orderBy(
      desc(count(stores.stripeAccountId)),
      desc(count(products.images)),
      desc(products.createdAt)
    )

  const productsRoutes = allProducts.map((product) => ({
    url: absoluteUrl(`/product/${product.id}`),
    lastModified: new Date().toISOString(),
  }))

  const allCategories = await getCategories()

  const categoriesRoutes = allCategories.map((category) => ({
    url: absoluteUrl(`/collections/${category.slug}`),
    lastModified: new Date().toISOString(),
  }))

  const allSubcategories = await getSubcategories()

  const subcategoriesRoutes = allSubcategories
    .map((s) =>
      categoriesRoutes.map((c) => ({
        url: absoluteUrl(`/collections/${c.url.split("/").pop()}/${s.slug}`),
        lastModified: new Date().toISOString(),
      }))
    )
    .flat()

  const pagesRoutes = allPages.map((page) => ({
    url: absoluteUrl(`${page.slug}`),
    lastModified: new Date().toISOString(),
  }))

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
    ...pagesRoutes,
    ...postsRoutes,
  ]
}
