import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"

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

interface UsageCardProps {
  title: string
  usage: number
  limit: number
  progress: number
  moreInfo: string
}

export function UsageCard({
  title,
  limit,
  progress,
  usage,
  moreInfo,
}: UsageCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <CardTitle>{title}</CardTitle>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="size-4">
                <QuestionMarkCircledIcon
                  className="size-full"
                  aria-hidden="true"
                />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80" sideOffset={8}>
              <p className="text-sm">{moreInfo}</p>
            </HoverCardContent>
          </HoverCard>
        </div>
        <CardDescription>
          {usage} / {limit} stores ({progress}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress className="w-full" value={progress} max={100} />
      </CardContent>
    </Card>
  )
}
