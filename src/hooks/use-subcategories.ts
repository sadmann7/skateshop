import * as React from "react"

import { productCategories } from "@/config/products"

export function useSubcategories(category?: string) {
  const [subcategories, setSubcategories] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!category) return

    const subcategories = productCategories.find(
      (c) => c.name === category
    )?.subcategories

    setSubcategories(subcategories ?? [])
  }, [category])

  return subcategories
}
