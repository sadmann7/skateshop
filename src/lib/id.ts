import { customAlphabet } from "nanoid";

const prefixes = {
  store: "str",
  product: "prd",
  category: "cat",
  subcategory: "sub",
  cart: "crt",
  subscription: "sub",
  payment: "pay",
  address: "adr",
  order: "ord",
  notification: "not",
};

interface GenerateIdOptions {
  length?: number;
  separator?: string;
}

export function generateId(
  prefix?: keyof typeof prefixes,
  { length = 12, separator = "_" }: GenerateIdOptions = {},
) {
  const id = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length,
  )();
  return prefix ? `${prefixes[prefix]}${separator}${id}` : id;
}
