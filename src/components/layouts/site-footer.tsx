import Link from "next/link"
import { type FooterItem } from "@/types"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { SubscribeToNewsletterForm } from "@/components/forms/subscribe-to-newsletter-form"
import { Icons } from "@/components/icons"
import { ThemeToggle } from "@/components/layouts/theme-toggle"
import { Shell } from "@/components/shell"

const footerItems: FooterItem[] = [
  {
    title: "Credits",
    items: [
      {
        title: "OneStopShop",
        href: "https://onestopshop.jackblatch.com/",
        external: true,
      },
      {
        title: "Acme Corp",
        href: "https://acme-corp.jumr.dev/",
        external: true,
      },
      {
        title: "shadcn/ui",
        href: "https://ui.shadcn.com/",
        external: true,
      },
      {
        title: "Taxonomy",
        href: "https://tx.shadcn.com/",
        external: true,
      },
    ],
  },
  {
    title: "Help",
    items: [
      {
        title: "About",
        href: "/about",
      },
      {
        title: "Contact",
        href: "/contact",
      },
      {
        title: "Terms",
        href: "/terms",
      },
      {
        title: "Privacy",
        href: "/privacy",
      },
    ],
  },
  {
    title: "Social",
    items: [
      {
        title: "Twitter",
        href: siteConfig.links.twitter,
        external: true,
      },
      {
        title: "GitHub",
        href: siteConfig.links.githubAccount,
        external: true,
      },
      {
        title: "Discord",
        href: siteConfig.links.discord,
        external: true,
      },
      {
        title: "cal.com",
        href: siteConfig.links.calDotCom,
        external: true,
      },
    ],
  },
  {
    title: "Lofi",
    items: [
      {
        title: "beats to study to",
        href: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        external: true,
      },
      {
        title: "beats to chill to",
        href: "https://www.youtube.com/watch?v=rUxyKA_-grg",
        external: true,
      },
      {
        title: "a fresh start",
        href: "https://www.youtube.com/watch?v=rwionZbOryo",
        external: true,
      },
      {
        title: "coffee to go",
        href: "https://www.youtube.com/watch?v=2gliGzb2_1I",
        external: true,
      },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <Shell as="div">
        <section
          id="footer-content"
          aria-labelledby="footer-content-heading"
          className="flex flex-col gap-10 lg:flex-row lg:gap-20"
        >
          <section
            id="footer-branding"
            aria-labelledby="footer-branding-heading"
          >
            <Link
              aria-label="Home"
              href="/"
              className="flex items-center space-x-2"
            >
              <Icons.logo className="h-6 w-6" aria-hidden="true" />
              <span className="font-bold">{siteConfig.name}</span>
            </Link>
          </section>
          <section
            id="footer-links"
            aria-labelledby="footer-links-heading"
            className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-4"
          >
            {footerItems.map((item) => (
              <div key={item.title} className="space-y-3">
                <h4 className="text-base font-medium">{item.title}</h4>
                <ul className="space-y-3">
                  {item.items.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        target={link?.external ? "_blank" : undefined}
                        rel={link?.external ? "noreferrer" : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.title}
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          <section
            id="newsletter"
            aria-labelledby="newsletter-heading"
            className="space-y-2.5"
          >
            <h4 className="text-base font-medium">
              Subscribe to our newsletter
            </h4>
            <SubscribeToNewsletterForm />
          </section>
        </section>
        <section
          id="footer-bottom"
          aria-labelledby="footer-bottom-heading"
          className="flex flex-col items-center justify-between space-y-1 md:flex-row"
        >
          <div className="text-center text-sm leading-loose text-muted-foreground">
            Built by{" "}
            <a
              aria-label="Kickflip tutorial on YouTube"
              href="https://twitter.com/sadmann17"
              target="_blank"
              rel="noreferrer"
              className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
            >
              Sadman
            </a>
            .
          </div>
          <div className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    size: "icon",
                    variant: "ghost",
                  })
                )}
              >
                <Icons.gitHub className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </section>
      </Shell>
    </footer>
  )
}
