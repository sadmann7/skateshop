import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ContentSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  href: string
  linkText?: string
  children: React.ReactNode
  asChild?: boolean
}

export function ContentSection({
  title,
  description,
  href,
  linkText = "View all",
  children,
  className,
  asChild = false,
  ...props
}: ContentSectionProps) {
  const ChildrenShell = asChild ? Slot : "div"

  return (
    <section className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex max-w-[61.25rem] flex-1 flex-col gap-0.5">
          <h2 className="text-2xl font-bold leading-[1.1] md:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-[46.875rem] text-balance text-sm leading-normal text-muted-foreground sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
        <Button variant="outline" className="hidden sm:flex" asChild>
          <Link href={href}>
            {linkText}
            <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
            <span className="sr-only"> {linkText}</span>
          </Link>
        </Button>
      </div>
      <div className="space-y-8">
        <ChildrenShell
          className={cn(
            !asChild &&
              "grid gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          )}
        >
          {children}
        </ChildrenShell>
        <Button
          variant="ghost"
          className="mx-auto flex w-fit sm:hidden"
          asChild
        >
          <Link href={href}>
            {linkText}
            <ArrowRightIcon className="ml-2 size-4" aria-hidden="true" />
            <span className="sr-only"> {linkText}</span>
          </Link>
        </Button>
      </div>
    </section>
  )
}
