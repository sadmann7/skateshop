export const unknownError = "An unknown error occurred. Please try again later."

export const redirects = {
  toLogin: "/signin",
  toSignup: "/signup",
  afterLogin: "/dashboard/stores",
  afterLogout: "/",
  toVerify: "/verify-email",
  afterVerify: "/dashboard/stores",
} as const

export const dbPrefix = "skateshop"
