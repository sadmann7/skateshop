import Image from "next/image"
import Link from "next/link"
import Balance from "react-wrap-balancer"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function Hero() {
  return (
    <AspectRatio ratio={16 / 9}>
      <div className="absolute inset-0 z-20 bg-black/80" />
      <Image
        src="/images/hero-one.webp"
        alt="Hero"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 z-30 grid h-full w-full place-items-center">
        <div className="flex h-full w-full max-w-[980px] flex-col items-center justify-center px-4 py-8 text-center">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter text-zinc-50 md:text-5xl lg:leading-[1.1]">
            Buy rad skating goodies
          </h1>
          <Balance className="mt-2.5 max-w-[750px] text-lg text-zinc-400 sm:text-xl">
            Explore our collection of skateboards, wheels, trucks, bearings, and
            more
          </Balance>
          <div className="mt-2.5 flex w-full items-center justify-center space-x-4 pb-8 pt-4 md:pb-10">
            <Link
              href="/products"
              className={cn(
                buttonVariants({
                  className: "bg-zinc-50 text-zinc-950 hover:bg-zinc-50/90",
                })
              )}
            >
              Shop Now
            </Link>
            <Link
              target="_blank"
              rel="noreferrer"
              href={siteConfig.links.github}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className:
                    "bg-transparent text-zinc-50 hover:bg-zinc-950 hover:text-zinc-50",
                })
              )}
            >
              <Icons.gitHub className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </AspectRatio>
  )
}
