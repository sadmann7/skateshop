/** Originally from `t3-env-docs`
 * @link https://github.com/t3-oss/t3-env/blob/main/docs/src/components/mdx/code-block.tsx
 */
import * as React from "react"

import { CopyButton } from "@/components/copy-button"

type CodeBlockProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
> & {
  raw?: string
}

export function CodeBlock({ children, raw, ...props }: CodeBlockProps) {
  return (
    <>
      <CopyButton value={raw} />
      <pre
        className="relative mb-4 mt-6 max-h-[640px] overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm font-semibold text-muted-foreground"
        {...props}
      >
        {children}
      </pre>
    </>
  )
}
