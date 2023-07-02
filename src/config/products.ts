import { type Product } from "@/db/schema"
import type { Option } from "@/types"

export const sortOptions = [
  { label: "Date: Old to new", value: "createdAt.asc" },
  {
    label: "Date: New to old",
    value: "createdAt.desc",
  },
  { label: "Price: Low to high", value: "price.asc" },
  { label: "Price: High to low", value: "price.desc" },
  {
    label: "Alphabetical: A to Z",
    value: "name.asc",
  },
  {
    label: "Alphabetical: Z to A",
    value: "name.desc",
  },
]

export const productCategories = [
  {
    title: "skateboards",
    image: "/images/skateboard-one.webp",
    subcategories: [
      {
        title: "Decks",
        description: "The board itself.",
        image: "/images/deck-one.webp",
        slug: "decks",
      },
      {
        title: "Wheels",
        description: "The wheels that go on the board.",
        image: "/images/wheel-one.webp",
        slug: "wheels",
      },
      {
        title: "Trucks",
        description: "The trucks that go on the board.",
        image: "/images/truck-one.webp",
        slug: "trucks",
      },
      {
        title: "Bearings",
        description: "The bearings that go in the wheels.",
        image: "/images/bearing-one.webp",
        slug: "bearings",
      },
      {
        title: "Griptape",
        description: "The griptape that goes on the board.",
        image: "/images/griptape-one.webp",
        slug: "griptape",
      },
      {
        title: "Hardware",
        description: "The hardware that goes on the board.",
        image: "/images/hardware-one.webp",
        slug: "hardware",
      },
      {
        title: "Tools",
        description: "The tools that go with the board.",
        image: "/images/tool-one.webp",
        slug: "tools",
      },
    ],
  },
  {
    title: "clothing",
    image: "/images/clothing-one.webp",
    subcategories: [
      {
        title: "T-shirts",
        description: "Cool and comfy tees for effortless style.",
        slug: "t-shirts",
      },
      {
        title: "Hoodies",
        description: "Cozy up in trendy hoodies.",
        slug: "hoodies",
      },
      {
        title: "Pants",
        description: "Relaxed and stylish pants for everyday wear.",
        slug: "pants",
      },
      {
        title: "Shorts",
        description: "Stay cool with casual and comfortable shorts.",
        slug: "shorts",
      },
      {
        title: "Hats",
        description: "Top off your look with stylish and laid-back hats.",
        slug: "hats",
      },
    ],
  },
  {
    title: "shoes",
    image: "/images/shoe-one.webp",
    subcategories: [
      {
        title: "Low Tops",
        description: "Rad low tops shoes for a stylish low-profile look.",
        slug: "low-tops",
      },
      {
        title: "High Tops",
        description: "Elevate your style with rad high top shoes.",
        slug: "high-tops",
      },
      {
        title: "Slip-ons",
        description: "Effortless style with rad slip-on shoes.",
        slug: "slip-ons",
      },
      {
        title: "Pros",
        description: "Performance-driven rad shoes for the pros.",
        slug: "pros",
      },
      {
        title: "Classics",
        description: "Timeless style with rad classic shoes.",
        slug: "classics",
      },
    ],
  },
  {
    title: "accessories",
    image: "/images/backpack-one.webp",
    subcategories: [
      {
        title: "Skate Tools",
        description:
          "Essential tools for maintaining your skateboard, all rad.",
        slug: "skate-tools",
      },
      {
        title: "Bushings",
        description: "Upgrade your ride with our rad selection of bushings.",
        slug: "bushings",
      },
      {
        title: "Shock & Riser Pads",
        description:
          "Enhance your skateboard's performance with rad shock and riser pads.",
        slug: "shock-riser-pads",
      },
      {
        title: "Skate Rails",
        description:
          "Add creativity and style to your tricks with our rad skate rails.",
        slug: "skate-rails",
      },
      {
        title: "Wax",
        description: "Keep your board gliding smoothly with our rad skate wax.",
        slug: "wax",
      },
      {
        title: "Socks",
        description: "Keep your feet comfy and stylish with our rad socks.",
        slug: "socks",
      },
      {
        title: "Backpacks",
        description: "Carry your gear in style with our rad backpacks.",
        slug: "backpacks",
      },
    ],
  },
] satisfies {
  title: Product["category"]
  image: string
  subcategories: {
    title: string
    description?: string
    image?: string
    slug: string
  }[]
}[]

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

export function getSubcategories(category?: string): Option[] {
  if (!category) return []

  const subcategories =
    productCategories
      .find((c) => c.title === category)
      ?.subcategories.map((s) => ({
        label: s.title,
        value: s.slug,
      })) ?? []

  return subcategories
}
