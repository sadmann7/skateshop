/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { OpenAIStream, StreamingTextResponse } from "ai"

import { functions, openai, runFunction } from "@/lib/openai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    messages,
    stream: true,
    functions,
    function_call: "auto",
  })

  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages
    ) => {
      const result = await runFunction(name, args)
      const newMessages = createFunctionCallMessages(result)
      return openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        stream: true,
        messages: [...messages, ...newMessages],
      })
    },
  })

  return new StreamingTextResponse(stream)
}
