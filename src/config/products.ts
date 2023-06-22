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
  title: Product["category"]
  subcategories: { title: string; description?: string; image?: string }[]
}[] = [
  {
    title: "skateboards",
    subcategories: [
      {
        title: "decks",
        description: "The board itself.",
        image: "/images/deck-one.webp",
      },
      {
        title: "wheels",
        description: "The wheels that go on the board.",
        image: "/images/wheel-one.webp",
      },
      {
        title: "trucks",
        description: "The trucks that go on the board.",
        image: "/images/truck-one.webp",
      },
      {
        title: "bearings",
        description: "The bearings that go in the wheels.",
        image: "/images/bearing-one.webp",
      },
      {
        title: "griptape",
        description: "The griptape that goes on the board.",
        image: "/images/griptape-one.webp",
      },
      {
        title: "hardware",
        description: "The hardware that goes on the board.",
        image: "/images/hardware-one.webp",
      },
      {
        title: "tools",
        description: "The tools that go with the board.",
        image: "/images/tool-one.webp",
      },
    ],
  },
  {
    title: "clothing",
    subcategories: [
      {
        title: "t-shirts",
        description: "Cool and comfy tees for effortless style.",
      },
      { title: "sweatshirts", description: "Cozy up in trendy sweatshirts." },
      {
        title: "pants",
        description: "Relaxed and stylish pants for everyday wear.",
      },
      {
        title: "shorts",
        description: "Stay cool with casual and comfortable shorts.",
      },
      {
        title: "hats",
        description: "Top off your look with stylish and laid-back hats.",
      },
    ],
  },
  {
    title: "shoes",
    subcategories: [
      {
        title: "low tops",
        description: "Rad low tops shoes for a stylish low-profile look.",
      },
      {
        title: "high tops",
        description: "Elevate your style with rad high top shoes.",
      },
      {
        title: "slip ons",
        description: "Effortless style with rad slip-on shoes.",
      },
      {
        title: "pros",
        description: "Performance-driven rad shoes for the pros.",
      },
      {
        title: "classics",
        description: "Timeless style with rad classic shoes.",
      },
    ],
  },
  {
    title: "accessories",
    subcategories: [
      {
        title: "skate tools",
        description:
          "Essential tools for maintaining your skateboard, all rad.",
      },
      {
        title: "bushings",
        description: "Upgrade your ride with our rad selection of bushings.",
      },
      {
        title: "shock & riser pads",
        description:
          "Enhance your skateboard's performance with rad shock and riser pads.",
      },
      {
        title: "skate rails",
        description:
          "Add creativity and style to your tricks with our rad skate rails.",
      },
      {
        title: "wax",
        description: "Keep your board gliding smoothly with our rad skate wax.",
      },
      {
        title: "socks",
        description: "Keep your feet comfy and stylish with our rad socks.",
      },
      {
        title: "backpacks",
        description: "Carry your gear in style with our rad backpacks.",
      },
    ],
  },
]

export const productTags = [
  "new",
  "sale",
  "bestseller",
  "featured",
  "popular",
  "trending",
  "limited",
  "exclusive",
]

export function getSubcategories(category?: string) {
  if (!category) return []

  const subcategories =
    productCategories
      .find((c) => c.title.toLowerCase() === category.toLowerCase())
      ?.subcategories.map((s) => s.title) ?? []

  return subcategories
}
