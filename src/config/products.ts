import { type Product } from "@/db/schema"
import type { Category, Option } from "@/types"
import { MixIcon } from "@radix-ui/react-icons"

import { Icons } from "@/components/icons"

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
    icon: Icons.logo,
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
    icon: Icons.shirt,
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
    icon: Icons.footprints,
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
    icon: MixIcon,
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
] satisfies Category[]

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

export const dummyProducts: Product[] = [
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Yuri black blur impact 8.5 skateboard deck",
    description: "Almost Yuri Black Blur Impact 8.5 Skateboard Deck",
    price: "74.95",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Yuri black blur impact 8.5 skateboard deck",
        url: "https://utfs.io/f/60f481bd-754a-4cc5-8988-4a17319255ef_deck-one.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Max mean pets paintings impact light 8.25 skateboard deck",
        url: "https://utfs.io/f/f7e7aabe-5878-4500-a22d-74995694bef2-5scd3q.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Youness gradient cuts impact 8.375 skateboard deck",
        url: "https://utfs.io/f/029b15c0-f634-4f13-bfd8-dc517b482959_deck-four.webp",
      },
    ],
    category: "skateboards",
    subcategory: "decks",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Yuri mean pets paintings impact light 8.375 skateboard deck",
    description:
      "Almost Yuri Mean Pets Paintings Impact Light 8.375 Skateboard Deck",
    price: "74.95",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Yuri mean pets paintings impact light 8.375 skateboard deck",
        url: "https://utfs.io/f/09d0e587-5770-4ad7-b5e6-3c700fa44e06-9coeym.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Max mean pets paintings impact light 8.25 skateboard deck",
        url: "https://utfs.io/f/f7e7aabe-5878-4500-a22d-74995694bef2-5scd3q.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Youness gradient cuts impact 8.375 skateboard deck",
        url: "https://utfs.io/f/029b15c0-f634-4f13-bfd8-dc517b482959_deck-four.webp",
      },
    ],
    category: "skateboards",
    subcategory: "decks",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Max mean pets paintings impact light 8.25 skateboard deck",
    description:
      "Almost Max Mean Pets Paintings Impact Light 8.25 Skateboard Deck",
    price: "74.95",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Max mean pets paintings impact light 8.25 skateboard deck",
        url: "https://utfs.io/f/f7e7aabe-5878-4500-a22d-74995694bef2-5scd3q.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Youness gradient cuts impact 8.375 skateboard deck",
        url: "https://utfs.io/f/029b15c0-f634-4f13-bfd8-dc517b482959_deck-four.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Yuri black blur impact 8.5 skateboard deck",
        url: "https://utfs.io/f/60f481bd-754a-4cc5-8988-4a17319255ef_deck-one.webp",
      },
    ],
    category: "skateboards",
    subcategory: "decks",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Youness gradient cuts impact 8.375 skateboard deck",
    description: "Almost Youness Gradient Cuts Impact 8.375 Skateboard Deck",
    price: "74.95",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Youness gradient cuts impact 8.375 skateboard deck",
        url: "https://utfs.io/f/029b15c0-f634-4f13-bfd8-dc517b482959_deck-four.webp",
      },
    ],
    category: "skateboards",
    subcategory: "decks",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Nike Air Force 1 '07",
    description:
      "It doesn't get more legendary than this. Crossing hardwood comfort with off-court flair, this hoops original pairs a crisp white leather upper with starry cosmic accents for style with every step. Hidden Nike Air units and durable, era-echoing '80s construction add the comfort you know and love.",
    price: "135",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Nike Air Force 1 '07",
        url: "https://utfs.io/f/4cf94b5c-73a0-4533-9164-7d341c266fdb-hpjse0.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Air Force 1 '07",
        url: "https://utfs.io/f/7549a840-00c1-4779-9ffa-6de287ecc082-jgyubn.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Air Force 1 '07",
        url: "https://utfs.io/f/7549a840-00c1-4779-9ffa-6de287ecc082-jgyubn.webp",
      },
    ],
    category: "skateboards",
    subcategory: "decks",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Nike InfinityRN 4",
    description:
      "With supportive cushioning built for a smooth run, the Nike InfinityRN 4 is a brand-new take on a familiar favorite. It's made from our all-new Nike ReactX foam, which gives you 13% more energy return compared with Nike React foam, to help you stay fresh and bouncy. (What's more? Nike ReactX reduces its carbon footprint in a pair of midsoles by at least 43% compared to Nike React foam.*) We coupled the ReactX foam with Nike Running's best-fitting Flyknit yet, so you can take off anytime, anywhere with secure upper support and breathability. It’s the kind of shoe that can grant you that priceless peace of mind to go faster and farther thanks to an intuitive design that supports every stride. *The carbon footprint of ReactX is based on cradle-to-gate assessment reviewed by PRé Sustainability B.V and Intertek China. Other midsole components such as airbags, plates or other foam formulations were not considered.",
    price: "160",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Nike InfinityRN 4",
        url: "https://utfs.io/f/d7415f6b-5da5-4bbc-b6d6-d6457443110c-3b9mk5.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike InfinityRN 4",
        url: "https://utfs.io/f/c43f2067-eacf-4668-8e4a-ab4537a21b71-mkcuiq.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike InfinityRN 4",
        url: "https://utfs.io/f/801b4f3e-4a3d-468d-ad6c-e2d8e7da6309-7ucg83.webp",
      },
    ],
    category: "skateboards",
    subcategory: "decks",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Nike Pegasus Trail 4 GORE-TEX",
    description:
      "The Nike Pegasus Trail 4 GORE-TEX is your running companion for those days when the weather turns. Its waterproof GORE-TEX layer helps keep your feet dry, and less rubber in the outsole creates a smooth transition from road to trail without breaking stride.",
    price: "140",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Nike Pegasus Trail 4 GORE-TEX",
        url: "https://utfs.io/f/cb257d00-0603-48ca-86a9-ca3a7eebff3b-4hkdzk.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Pegasus Trail 4 GORE-TEX",
        url: "https://utfs.io/f/e06bde8a-9ee2-4ff5-bcdc-6f060fe805b9-pogo06.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Pegasus Trail 4 GORE-TEX",
        url: "https://utfs.io/f/9f5b03bc-f5f7-4734-80f7-efc6f83b8d56-eeaksl.webp",
      },
    ],
    category: "shoes",
    subcategory: "pros",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Nike Pegasus 40 BTC",
    description:
      "A springy ride for every run, the Peg’s familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, but with improved comfort in those sensitive areas of your foot, like the arch and toes. Whether you’re logging long marathon miles, squeezing in a speed session before the sun goes down or hopping into a spontaneous group jaunt, it’s still the established road runner you can put your faith in, day after day, run after run.",
    price: "140",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Nike Pegasus 40 BTC",
        url: "https://utfs.io/f/28626cca-5a97-4ede-bcb3-68ffa7254cae-2r45tw.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Pegasus 40 BTC",
        url: "https://utfs.io/f/23facce4-b358-4d2d-b2f0-09710b37894b-xe92r.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Pegasus 40 BTC",
        url: "https://utfs.io/f/a3790b05-cf69-439e-b002-2a6baf39ccc8-jxivir.webp",
      },
    ],
    category: "shoes",
    subcategory: "pros",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Nike Streakfly",
    description:
      "Our lightest racing shoe, the Nike Streakfly is all about the speed you need to take on the competition in a mile, 5k or 10k race. Low profile with sleek details, it feels like it disappears on your foot to help you better connect with the road on the way to your personal best.",
    price: "170",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Nike Streakfly",
        url: "https://utfs.io/f/d2682ef9-b0d4-483e-b145-2530582f14bf-1xl88u.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Streakfly",
        url: "https://utfs.io/f/9b869899-1bd7-4271-a493-7777ccce4569-p9xkm9.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Streakfly",
        url: "https://utfs.io/f/241352b6-a86d-4f2f-87b9-97c6cb9e904d-4kqxah.webp",
      },
    ],
    category: "shoes",
    subcategory: "pros",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: Math.floor(
      Math.random() * new Date().getTime() +
        new Date().getMilliseconds() +
        Math.random()
    ),
    name: "Nike Air Max 2013",
    description:
      "Back and just as stylish as ever. The Air Max 2013 returns with mesh detailing and sporty, no-sew overlays to help keep you looking and feeling fresh. Plus, tried-and-true Flywire lacing and classic full-length Air cushioning provide lasting comfort and support.",
    price: "180",
    images: [
      {
        id: crypto.randomUUID(),
        name: "Nike Air Max 2013",
        url: "https://utfs.io/f/839da893-5021-4882-aa01-eafc8385d8e5-hwtxdy.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Air Max 2013",
        url: "https://utfs.io/f/67f06bb7-e5b0-44fb-90ab-cdceccf7c545-tww166.webp",
      },
      {
        id: crypto.randomUUID(),
        name: "Nike Air Max 2013",
        url: "https://utfs.io/f/70394775-bb0c-4522-bf77-3cd71ee7a2ce-2t78fm.webp",
      },
    ],
    category: "shoes",
    subcategory: "pros",
    storeId: 1,
    inventory: 50,
    rating: 4,
    tags: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
