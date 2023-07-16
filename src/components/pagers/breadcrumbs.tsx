import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface BreadcrumbsProps {
  segments: {
    title: string
    href: string
  }[]
  separator?: keyof typeof Icons
}

export function Breadcrumbs({ segments, separator }: BreadcrumbsProps) {
  const SeparatorIcon = Icons[separator ?? "chevronRight"]

  return (
    <nav
      aria-label="breadcrumbs"
      className="flex items-center text-sm font-medium text-muted-foreground"
    >
      {segments.map((segment, index) => {
        const isLastSegment = index === segments.length - 1

        return (
          <React.Fragment key={segment.href}>
            <Link
              aria-current={isLastSegment ? "page" : undefined}
              href={segment.href}
              className={cn(
                "truncate transition-colors hover:text-muted-foreground",
                isLastSegment
                  ? "pointer-events-none text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {segment.title}
            </Link>
            {!isLastSegment && (
              <SeparatorIcon className="mx-2 h-4 w-4" aria-hidden="true" />
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
