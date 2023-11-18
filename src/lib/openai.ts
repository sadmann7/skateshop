/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { OpenAI } from "openai"
import { type ChatCompletionCreateParams } from "openai/resources/chat/index"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "get_top_stories",
    description:
      "Get the top stories from Hacker News. Also returns the Hacker News URL to each story.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "The number of stories to return. Defaults to 10.",
        },
      },
      required: [],
    },
  },
  {
    name: "get_story",
    description:
      "Get a story from Hacker News. Also returns the Hacker News URL to the story.",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The ID of the story",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "get_story_with_comments",
    description:
      "Get a story from Hacker News with comments.  Also returns the Hacker News URL to the story and each comment.",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "number",
          description: "The ID of the story",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "summarize_top_story",
    description:
      "Summarize the top story from Hacker News, including both the story and its comments. Also returns the Hacker News URL to the story and each comment.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
]

async function get_top_stories(limit: number = 10) {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  )
  const ids = await response.json()
  const stories = await Promise.all(
    ids.slice(0, limit).map((id: number) => get_story(id))
  )
  return stories
}

async function get_story(id: number) {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  )
  const data = await response.json()
  return {
    ...data,
    hnUrl: `https://news.ycombinator.com/item?id=${id}`,
  }
}

async function get_story_with_comments(id: number) {
  const response = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
  )
  const data = await response.json()
  const comments = await Promise.all(
    data.kids.slice(0, 10).map((id: number) => get_story(id))
  )
  return {
    ...data,
    hnUrl: `https://news.ycombinator.com/item?id=${id}`,
    comments: comments.map((comment: any) => ({
      ...comment,
      hnUrl: `https://news.ycombinator.com/item?id=${comment.id}`,
    })),
  }
}

async function summarize_top_story() {
  const topStory = await get_top_stories(1)
  return await get_story_with_comments(topStory[0].id)
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "get_top_stories":
      return await get_top_stories()
    case "get_story":
      return await get_story(args["id"])
    case "get_story_with_comments":
      return await get_story_with_comments(args["id"])
    case "summarize_top_story":
      return await summarize_top_story()
    default:
      return null
  }
}
