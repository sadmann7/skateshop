import { type MetadataRoute } from "next"
import { db } from "@/db"
import { categories, products, stores, subcategories } from "@/db/schema"
import { allPages, allPosts } from "contentlayer/generated"
import { count, desc, eq, sql } from "drizzle-orm"

import { absoluteUrl } from "@/lib/utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  async function getAllStores() {
    try {
      return await db
        .select({
          id: stores.id,
        })
        .from(stores)
        .leftJoin(products, eq(products.storeId, stores.id))
        // Google's limit is 50,000 URLs per sitemap
        .limit(50000)
        .offset(0)
        .groupBy(stores.id)
        .orderBy(desc(sql<number>`count(*)`))
    } catch (err) {
      return []
    }
  }

  const storesRoutes = (await getAllStores()).map((store) => ({
    url: absoluteUrl(`/products?store_ids=${store.id}`),
    lastModified: new Date().toISOString(),
  }))

  async function getAllProducts() {
    try {
      return await db
        .select({
          id: products.id,
        })
        .from(products)
        .leftJoin(stores, eq(products.storeId, stores.id))
        // Google's limit is 50,000 URLs per sitemap
        .limit(50000)
        .offset(0)
        .groupBy(products.id)
        .orderBy(
          desc(count(stores.stripeAccountId)),
          desc(count(products.images)),
          desc(products.createdAt)
        )
    } catch (err) {
      return []
    }
  }

  const productsRoutes = (await getAllProducts()).map((product) => ({
    url: absoluteUrl(`/product/${product.id}`),
    lastModified: new Date().toISOString(),
  }))

  async function getAllCategories() {
    try {
      return await db
        .selectDistinct({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
        })
        .from(categories)
        .orderBy(desc(categories.name))
    } catch (err) {
      return []
    }
  }

  const categoriesRoutes = (await getAllCategories()).map((category) => ({
    url: absoluteUrl(`/collections/${category.slug}`),
    lastModified: new Date().toISOString(),
  }))

  async function getAllSubcategories() {
    try {
      return await db
        .selectDistinct({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
        })
        .from(subcategories)
    } catch (err) {
      return []
    }
  }

  const subcategoriesRoutes = (await getAllSubcategories())
    .map((s) =>
      categoriesRoutes.map((c) => ({
        url: absoluteUrl(`/collections/${c.url.split("/").pop()}/${s.slug}`),
        lastModified: new Date().toISOString(),
      }))
    )
    .flat()

  const pagesRoutes = allPages.map((page) => ({
    url: absoluteUrl(page.slug),
    lastModified: new Date().toISOString(),
  }))

  const postsRoutes = allPosts.map((post) => ({
    url: absoluteUrl(post.slug),
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
