import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  href: string
  linkText?: string
  children: React.ReactNode
}

export function ContentSection({
  title,
  description,
  href,
  linkText = "View all",
  children,
  className,
  ...props
}: ContentSectionProps) {
  return (
    <section className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between gap-4">
        <div className="max-w-[58rem] flex-1 space-y-1">
          <h2 className="font-heading text-3xl font-bold leading-[1.1] md:text-4xl">
            {title}
          </h2>
          {description ? (
            <Balancer className="max-w-[46rem] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              {description}
            </Balancer>
          ) : null}
        </div>
        <Link
          href={href}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "hidden sm:flex",
            })
          )}
        >
          {linkText}
          <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
          <span className="sr-only"> {linkText}</span>
        </Link>
      </div>
      <div className="space-y-8">
        {children}
        <Link
          href={href}
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "mx-auto flex w-fit sm:hidden",
            })
          )}
        >
          {linkText}
          <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
          <span className="sr-only"> {linkText}</span>
        </Link>
      </div>
    </section>
  )
}
