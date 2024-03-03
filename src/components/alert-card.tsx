import { RocketIcon } from "@radix-ui/react-icons"

import { siteConfig } from "@/config/site"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Icons } from "@/components/icons"

interface AlertCardProps {
  title?: string
  description?: string
  icon?: keyof typeof Icons
}

export function AlertCard({
  title = "Rewriting with the latest Next.js 14 features and mental models!",
  description = `Will post updates on x (${siteConfig.links.x})`,
  icon,
}: AlertCardProps) {
  const Icon = icon ? Icons[icon] : RocketIcon

  return (
    <Alert className="flex flex-col items-center justify-center space-y-8 p-16">
      <div className="flex aspect-square size-fit items-center justify-center rounded-full border border-dashed p-4">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col items-center space-y-2 text-center">
        <AlertTitle className="text-lg">{title}</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          {description}
        </AlertDescription>
      </div>
    </Alert>
  )
}
