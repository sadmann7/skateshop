import { type MetadataRoute } from "next"

import { productCategories } from "@/config/products"
import { siteConfig } from "@/config/site"
import { getProductsAction } from "@/app/_actions/product"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsTransaction = await getProductsAction({
    limit: 10,
    offset: 0,
    sort: "createdAt.desc",
  })

  const products = productsTransaction.items.map((product) => ({
    url: `${siteConfig.url}/product/${product.id}`,
    lastModified: new Date().toISOString(),
  }))

  const categories = productCategories.map((category) => ({
    url: `${siteConfig.url}/categories/${category.title}`,
    lastModified: new Date().toISOString(),
  }))

  const subcategories = productCategories
    .map((category) =>
      category.subcategories.map((subcategory) => ({
        url: `${siteConfig.url}/categories/${category.title}/${subcategory.slug}`,
        lastModified: new Date().toISOString(),
      }))
    )
    .flat()

  const routes = [
    "",
    "/products",
    "/build-a-board",
    "/blog",
    "/dashboard/account",
    "/dashboard/stores",
    "/dashboard/billing",
    "/dashboard/purchases",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
  }))

  return [...routes, ...products, ...categories, ...subcategories]
}
