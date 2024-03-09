import React from "react"
import Link from "next/link"
import { RocketIcon } from "@radix-ui/react-icons"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from "@/components/icons"

interface AlertCardProps extends React.ComponentPropsWithoutRef<typeof Alert> {
  title?: string
  description?: string
  icon?: keyof typeof Icons
}

export function AlertCard({
  title,
  description,
  icon,
  children,
  className,
  ...props
}: AlertCardProps) {
  const Icon = icon ? Icons[icon] : RocketIcon

  return (
    <Alert
      className={cn(
        "flex flex-col items-center justify-center space-y-8 p-16",
        className
      )}
      {...props}
    >
      <div className="flex aspect-square size-fit items-center justify-center rounded-full border border-dashed p-4">
        <Icon className="size-5" />
      </div>
      {children ?? (
        <div className="flex flex-col items-center space-y-2 text-center">
          <AlertTitle className="text-lg">
            {title ?? "Rewriting with the latest Next.js 14 features!"}
          </AlertTitle>
          {description ? (
            <AlertDescription className="text-muted-foreground">
              {description}
            </AlertDescription>
          ) : (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertDescription>Follow along on</AlertDescription>
              <Link
                href={siteConfig.links.x}
                className="transition-colors hover:text-foreground"
              >
                X
              </Link>
            </div>
          )}
        </div>
      )}
    </Alert>
  )
}
