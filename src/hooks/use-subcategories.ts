import * as React from "react"

import { productCategories } from "@/config/products"

export function useSubcategories(category?: string) {
  const [subcategories, setSubcategories] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!category) return

    const subcategories = productCategories
      .find((c) => c.title === category)
      ?.subcategories.map((s) => s.title)

    setSubcategories(subcategories ?? [])
  }, [category])

  return subcategories
}
