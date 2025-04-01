export const unknownError =
  "An unknown error occurred. Please try again later.";

export const redirects = {
  toLogin: "/signin",
  toSignup: "/signup",
  afterLogin: "/dashboard/stores",
  afterLogout: "/",
  toVerify: "/verify-email",
  afterVerify: "/dashboard/stores",
} as const;

export const CART_COOKIE_NAME = "cartId";
export const CART_COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30, // 30 days
} as const;
