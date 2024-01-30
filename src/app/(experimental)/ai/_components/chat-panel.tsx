import { ReloadIcon, StopIcon } from "@radix-ui/react-icons"
import { type UseChatHelpers } from "ai/react"

import { Button } from "@/components/ui/button"

import { PromptForm } from "./prompt-form"
import { ScrollToBottomButton } from "./scroll-to-bottom-button"

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50% md:sticky">
      <ScrollToBottomButton />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <StopIcon className="mr-2 size-4" aria-hidden="true" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => void reload()}
                className="bg-background"
              >
                <ReloadIcon className="mr-2 size-4" aria-hidden="true" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <PromptForm
          onSubmit={async (value) => {
            await append({
              id,
              content: value,
              role: "user",
            })
          }}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
