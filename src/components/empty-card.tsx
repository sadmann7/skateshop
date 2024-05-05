import { cn } from "@/lib/utils"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface EmptyCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string
  description?: string
  icon?: keyof typeof Icons
}

export function EmptyCard({
  title,
  description,
  icon = "placeholder",
  children,
  className,
  ...props
}: EmptyCardProps) {
  const Icon = Icons[icon]

  return (
    <Card
      className={cn(
        "flex w-full flex-col items-center justify-center space-y-6 rounded-md border-dashed bg-transparent p-16",
        className
      )}
      {...props}
    >
      <div className="mr-4 shrink-0 rounded-full border border-dashed p-4">
        <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </div>
      {children}
    </Card>
  )
}
