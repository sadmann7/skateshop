export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Skateshop13",
  description:
    "An open source e-commerce skateshop build with everything new in Next.js 13",
  url: "https://skateshop13.vercel.app/",
  ogImage: "https://skateshop13.vercel.app/opengraph-image.png",
  mainNav: [
    {
      title: "Skateboards",
      href: "/skateboards",
    },
    {
      title: "Clothing",
      href: "/clothing",
    },
    {
      title: "Shoes",
      href: "/shoes",
    },
    {
      title: "Accessories",
      href: "/accessories",
    },
    {
      title: "Build a Board",
      href: "/build-a-board",
    },
  ],
  links: {
    twitter: "https://twitter.com/sadmann17",
    github: "https://github.com/sadmann7/skateshop",
  },
}
