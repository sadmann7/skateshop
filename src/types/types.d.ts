// This is a temporary hack to allow async components to be used in JSX
// Credit: HeyImMapleLeaf

declare global {
  namespace JSX {
    type ElementType =
      | keyof JSX.IntrinsicElements
      | ((props: any) => Promise<ReactNode> | React.ReactNode)
  }
}
