import { AvatarIcon } from "@radix-ui/react-icons"
import { type Message } from "ai"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

import { MemoizedReactMarkdown } from "./markdown"

export interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="group relative mb-4 flex items-start md:-ml-12">
      <div
        className={cn(
          "flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          message.role === "user"
            ? "bg-background"
            : "bg-primary text-primary-foreground"
        )}
      >
        {message.role === "user" ? (
          <AvatarIcon className="size-4" aria-hidden="true" />
        ) : (
          <Icons.robot className="size-4" aria-hidden="true" />
        )}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <MemoizedReactMarkdown
          className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
          // @ts-expect-error  type check to be implemented here for Pluggable
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className="mb-2 last:mb-0">{children}</p>
            },
          }}
        >
          {message.content}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}
