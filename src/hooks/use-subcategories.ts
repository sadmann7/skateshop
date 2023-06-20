import * as React from "react"

import { productCategories } from "@/config/products"

export function useSubcategories(
  category?: string,
  setSelectedSubcategory?: React.Dispatch<React.SetStateAction<string[] | null>>
) {
  const [subcategories, setSubcategories] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!category) return

    setSelectedSubcategory?.([])

    const subcategories = productCategories.find(
      (c) => c.name === category
    )?.subcategories

    setSubcategories(subcategories ?? [])
  }, [category, setSelectedSubcategory])

  return subcategories
}
