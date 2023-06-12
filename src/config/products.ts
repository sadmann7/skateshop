export const sortOptions = [
  {
    label: "Date (New to Old)",
    value: "createdAt",
    order: "desc",
  },
  { label: "Date (Old to New)", value: "createdAt", order: "asc" },
  { label: "Price (Low to High)", value: "price", order: "asc" },
  { label: "Price (High to Low)", value: "price", order: "desc" },
  {
    label: "Rating (Low to High)",
    value: "rating",
    order: "asc",
  },
  {
    label: "Rating (High to Low)",
    value: "rating",
    order: "desc",
  },
  {
    label: "Alphabetical (A to Z)",
    value: "name",
    order: "asc",
  },
  {
    label: "Alphabetical (Z to A)",
    value: "name",
    order: "desc",
  },
]
