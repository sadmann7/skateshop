import { Toaster as ReactToaster } from "react-hot-toast"

export function Toaster() {
  return (
    <ReactToaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  )
}
