import * as React from "react"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import { type UseChatHelpers } from "ai/react"

import { catchError } from "@/lib/utils"
import { useEnterSubmit } from "@/hooks/use-enter-submit"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"
import { TextareaAutosize } from "@/components/textarea-autosize"

export interface PromptFormProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
}: PromptFormProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }, [])

  async function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault()
      if (!input?.trim()) return
      setInput("")
      await onSubmit(input)
    } catch (err) {
      catchError(err)
    }
  }

  return (
    <form
      className="relative flex max-h-60 w-full grow flex-col overflow-hidden border-t bg-background pl-2.5 pr-11 shadow-lg sm:rounded-md sm:border"
      onSubmit={(e) => void onFormSubmit(e)}
      ref={formRef}
    >
      <TextareaAutosize
        ref={inputRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Send a message"
        spellCheck={false}
        className="resize-none"
      />
      <div className="absolute right-4 top-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || input.length === 0}
            >
              {isLoading ? (
                <Icons.spinner
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <PaperPlaneIcon className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Send message</TooltipContent>
        </Tooltip>
      </div>
    </form>
  )
}
