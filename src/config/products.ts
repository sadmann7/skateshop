import { type Product } from "@/db/schema"

export const sortOptions = [
  { label: "Date: Old to new", value: "createdAt-asc" },
  {
    label: "Date: New to old",
    value: "createdAt-desc",
  },
  { label: "Price: Low to high", value: "price-asc" },
  { label: "Price: High to low", value: "price-desc" },
  {
    label: "Alphabetical: A to Z",
    value: "name-asc",
  },
  {
    label: "Alphabetical: Z to A",
    value: "name-desc",
  },
]

export const productCategories: {
  name: Product["category"]
  subcategories: string[]
}[] = [
  {
    name: "skateboards",
    subcategories: [
      "decks",
      "wheels",
      "trucks",
      "bearings",
      "griptape",
      "hardware",
      "tools",
    ],
  },
  {
    name: "clothing",
    subcategories: ["t-shirts", "sweatshirts", "pants", "shorts", "hats"],
  },
  {
    name: "shoes",
    subcategories: ["low tops", "high tops", "slip ons", "pros", "classics"],
  },
  {
    name: "accessories",
    subcategories: [
      "skate tools",
      "bushings",
      "shock & riser pads",
      "skate rails",
      "wax",
      "socks",
      "backpacks",
      "bags",
    ],
  },
]
