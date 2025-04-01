export type QueryConfig = typeof queryConfig;

export const queryConfig = {
  store: {
    sortOptions: [
      {
        label: "Item count: Low to high",
        value: "productCount.asc",
      },
      {
        label: "Item count: High to low",
        value: "productCount.desc",
      },
      { label: "Date: Old to new", value: "createdAt.asc" },
      {
        label: "Date: New to old",
        value: "createdAt.desc",
      },
      {
        label: "Alphabetical: A to Z",
        value: "name.asc",
      },
      {
        label: "Alphabetical: Z to A",
        value: "name.desc",
      },
    ],
    statusOptions: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  product: {
    sortOptions: [
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
    ],
  },
};
