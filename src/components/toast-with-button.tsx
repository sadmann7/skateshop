import type { ButtonHTMLAttributes } from "react"

import { Button } from "@/components/ui/button"

export function ToastWithButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 items-center">
        <SonnerSuccessIcon />
        Product updated successfully.
      </div>
      <Button
        role="button"
        aria-label="View product"
        size="sm"
        className="h-6"
        {...props}
      >
        {children}
      </Button>
    </div>
  )
}

export const SonnerSuccessIcon = () => {
  return (
    <div className="mr-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        height="20"
        width="20"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  )
}
