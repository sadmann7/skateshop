import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipButtonProps {
  children: React.ReactNode
  tooltip: string
}

export function TooltipContainer({ children, tooltip }: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
