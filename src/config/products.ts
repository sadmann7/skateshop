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

export const productCategories = [
  {
    name: "skateboards",
    subcategories: [
      {
        title: "decks",
        description: "The board itself.",
      },
      {
        title: "wheels",
        description: "The wheels that go on the board.",
      },
      {
        title: "trucks",
        description: "The trucks that go on the board.",
      },
      {
        title: "bearings",
        description: "The bearings that go in the wheels.",
      },
      {
        title: "griptape",
        description: "The griptape that goes on the board.",
      },
      {
        title: "hardware",
        description: "The hardware that goes on the board.",
      },
      {
        title: "tools",
        description: "The tools that go with the board.",
      },
    ],
  },
  {
    name: "clothing",
    subcategories: [
      { title: "t-shirts", description: "Rad t-shirts." },
      { title: "sweatshirts", description: "Rad sweatshirts." },
      { title: "pants", description: "Rad pants." },
      { title: "shorts", description: "Rad shorts." },
      { title: "hats", description: "Rad hats." },
    ],
  },
  {
    name: "shoes",
    subcategories: [
      { title: "low tops", description: "Rad low tops shoes." },
      { title: "high tops", description: "Rad high tops shoes." },
      { title: "slip ons", description: "Rad slip ons shoes." },
      { title: "pros", description: "Rad pros shoes." },
      { title: "classics", description: "Rad classics shoes." },
    ],
  },
  {
    name: "accessories",
    subcategories: [
      { title: "skate tools", description: "Rad skate tools." },
      { title: "bushings", description: "Rad bushings." },
      { title: "shock & riser pads", description: "Rad shock & riser pads." },
      { title: "skate rails", description: "Rad skate rails." },
      { title: "wax", description: "Rad wax." },
      { title: "socks", description: "Rad socks." },
      { title: "backpacks", description: "Rad backpacks." },
      { title: "bags", description: "Rad bags." },
    ],
  },
]
