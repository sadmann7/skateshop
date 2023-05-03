// inlined `React.JSXElementConstructor`
type ReactJSXElementConstructor<Props> =
  | ((props: Props) => React.ReactNode)
  | (new (props: Props) => React.Component<Props, unknown>);

declare global {
  namespace JSX {
    type ElementType = string | ReactJSXElementConstructor<unknown>;
  }
}
