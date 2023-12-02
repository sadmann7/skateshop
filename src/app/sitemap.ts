import { type MetadataRoute } from "next"
import { db } from "@/db"
import { allPosts } from "contentlayer/generated"
import { desc, eq, sql } from "drizzle-orm"
import { products, stores } from "drizzle/schema"

import { productCategories } from "@/config/products"
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
      desc(sql<number>`count(${stores.stripeAccountId})`),
      desc(sql<number>`count(${products.images})`),
      desc(products.createdAt)
    )

  const productsRoutes = allProducts.map((product) => ({
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
