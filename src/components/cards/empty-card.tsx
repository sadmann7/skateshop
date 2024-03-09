import { cn } from "@/lib/utils"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  className,
  ...props
}: EmptyCardProps) {
  const Icon = Icons[icon]

  return (
    <Card
      className={cn(
        "flex w-full flex-col items-center justify-center space-y-6 bg-transparent p-12",
        className
      )}
      {...props}
    >
      <div className="mr-4 shrink-0 rounded-full border border-dashed p-4">
        <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <CardHeader className="items-center p-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
