import { Toaster as ReactToaster } from "react-hot-toast"

export function Toaster() {
  return (
    <ReactToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))",
        },
      }}
    />
  )
}
