import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress"

interface UsageCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string
  count: number
  limit: number
  moreInfo?: string
}

export function UsageCard({
  title,
  count,
  limit,
  moreInfo,
  className,
  ...props
}: UsageCardProps) {
  const progress = Math.round((count / limit) * 100)

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{title}</CardTitle>
          {moreInfo && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="ghost" size="icon" className="size-4">
                  <QuestionMarkCircledIcon
                    className="size-full"
                    aria-hidden="true"
                  />
                </Button>
              </HoverCardTrigger>
              <HoverCardContent className="sm:w-80" sideOffset={8}>
                <p className="text-sm">{moreInfo}</p>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
        <CardDescription>
          {count} / {limit} stores ({progress}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress className="w-full" value={progress} max={100} />
      </CardContent>
    </Card>
  )
}
