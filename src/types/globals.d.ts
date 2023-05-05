import type * as React from "react"

declare global {
  namespace JSX {
    type ElementType =
      | keyof JSX.IntrinsicElements
      | React.ComponentType<any>
      | ((props: any) => Promise<React.ReactNode> | React.ReactNode)
  }
}
