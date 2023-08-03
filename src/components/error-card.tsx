import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface ErrorCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  icon?: keyof typeof Icons
  title: string
  description: string
  retryLink?: string
  retryLinkText?: string
}

export function ErrorCard({
  icon,
  title,
  description,
  retryLink,
  retryLinkText = "Go back",
  className,
  ...props
}: ErrorCardProps) {
  const Icon = Icons[icon ?? "warning"]

  return (
    <Card className={cn("grid place-items-center", className)} {...props}>
      <CardHeader>
        <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
          <Icon className="h-10 w-10" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="flex min-h-[176px] flex-col items-center justify-center space-y-4 text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      {retryLink ? (
        <CardFooter>
          <Link href={retryLink}>
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                })
              )}
            >
              {retryLinkText}
              <span className="sr-only">{retryLinkText}</span>
            </div>
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  )
}
