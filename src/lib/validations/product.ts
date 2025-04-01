import * as z from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  categoryId: z.string(),
  subcategoryId: z.string().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Must be a valid price",
  }),
  inventory: z.number(),
  images: z
    .custom<File[] | undefined | null>()
    .optional()
    .nullable()
    .default(null),
});

export const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  description: z.string().optional(),
  categoryId: z.string(),
  subcategoryId: z.string().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
    message: "Must be a valid price",
  }),
  inventory: z.number(),
  images: z
    .custom<File[] | undefined | null>()
    .optional()
    .nullable()
    .default(null),
});

export const filterProductsSchema = z.object({
  query: z.string(),
});

export const getProductInventorySchema = z.object({
  id: z.string(),
});

export const getProductsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  sort: z.string().optional().default("createdAt.desc"),
  categories: z.string().optional(),
  subcategory: z.string().optional(),
  subcategories: z.string().optional(),
  price_range: z.string().optional(),
  store_ids: z.string().optional(),
  store_page: z.coerce.number().default(1),
  active: z.string().optional().default("true"),
});

export const updateProductRatingSchema = z.object({
  id: z.string(),
  rating: z.number(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
export type UpdateProductSchema = z.infer<typeof updateProductSchema>;
export type FilterProductsSchema = z.infer<typeof filterProductsSchema>;
export type GetProductInventorySchema = z.infer<
  typeof getProductInventorySchema
>;
export type GetProductsSchema = z.infer<typeof getProductsSchema>;
export type UpdateProductRatingSchema = z.infer<
  typeof updateProductRatingSchema
>;
