import { type UseChatHelpers } from "ai/react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shell } from "@/components/shell"

const examples = [
  "Get me the top 5 stories on Hacker News in markdown table format. Use columns like title, link, score, and comments.",
  "Summarize the comments in the top hacker news story.",
  "What is the top story on Hacker News right now?",
]

type EmptyChatScreenProps = Pick<UseChatHelpers, "setInput">

export function EmptyChatScreen({ setInput }: EmptyChatScreenProps) {
  return (
    <Shell variant="centered" className="h-auto gap-14 px-4">
      <Card className="w-full space-y-4 p-6">
        {examples.map((example, i) => (
          <Button
            key={i}
            variant="secondary"
            className="h-auto w-full justify-start px-6 py-4 text-left"
            onClick={() => {
              setInput(example)
            }}
          >
            {example}
          </Button>
        ))}
      </Card>
    </Shell>
  )
}
