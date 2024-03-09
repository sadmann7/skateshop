import {
  defineDocumentType,
  makeSource,
  type ComputedFields,
} from "contentlayer/source-files"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeCodeTitles from "rehype-code-titles"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import { codeImport } from "remark-code-import"

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
  readingTime: {
    type: "number",
    resolve: (doc) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const content = doc.body.raw as string
      const wordsPerMinute = 200
      const numberOfWords = content.split(/\s/g).length
      const minutes = numberOfWords / wordsPerMinute
      return Math.ceil(minutes)
    },
  },
}

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    date: {
      type: "date",
      required: true,
    },
    published: {
      type: "boolean",
      default: true,
    },
    image: {
      type: "string",
      required: true,
    },
    authors: {
      // Reference types are not embedded.
      // Until this is fixed, we can use a simple list.
      // type: "reference",
      // of: Author,
      type: "list",
      of: { type: "string" },
      required: true,
    },
  },
  computedFields,
}))

export const Author = defineDocumentType(() => ({
  name: "Author",
  filePathPattern: `authors/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    avatar: {
      type: "string",
      required: true,
    },
    twitter: {
      type: "string",
      required: true,
    },
  },
  computedFields,
}))

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: "./src/content",
  documentTypes: [Post, Author, Page],
  mdx: {
    // @ts-expect-error - codeImport types are not compatible with remark plugins
    remarkPlugins: [codeImport],
    rehypePlugins: [
      [
        // @ts-expect-error - rehype-pretty-code types are not compatible with rehype plugins
        rehypePrettyCode,
        {
          theme: {
            dark: "one-dark-pro",
            light: "github-light",
          },
          defaultLang: {
            block: "typescript",
          },
        },
      ],
      rehypeAutolinkHeadings,
      rehypeSlug,
      rehypeCodeTitles,
    ],
  },
})
