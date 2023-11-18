"use client"

// Original source: https://github.com/vercel-labs/ai-chatbot/blob/main/lib/hooks/use-at-bottom.tsx
import { useChat } from "ai/react"
import { toast } from "sonner"

import { Separator } from "@/components/ui/separator"

import { ChatMessage } from "./chat-message"
import { ChatPanel } from "./chat-panel"
import { ChatScrollAnchor } from "./chat-scroll-anchor"
import { EmptyChatScreen } from "./empty-chat-screen"

export function Chat() {
  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      onResponse: (response) => {
        console.log(response)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })

  return (
    <>
      <div className="container max-w-2xl flex-1 pb-[100px] pt-4 md:pt-10">
        {messages.length ? (
          <>
            {messages.map((message, i) => (
              <div key={i}>
                <ChatMessage message={message} />
                {i < messages.length - 1 ? (
                  <Separator className="my-4 md:my-8" />
                ) : null}
              </div>
            ))}
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyChatScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
    </>
  )
}
