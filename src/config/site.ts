export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Skateshop",
  description:
    "An open source e-commerce skateshop build with everything new in Next.js",
  url: "https://skateshop.vercel.app/",
  ogImage: "https://skateshop.vercel.app/opengraph-image.png",
  mainNav: [
    {
      title: "Skateboards",
      href: "/skateboards",
    },
  ],
  secondaryNav: [
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
  ],
  links: {
    twitter: "https://twitter.com/sadmann17",
    github: "https://github.com/sadmann7/skateshop",
  },
};
