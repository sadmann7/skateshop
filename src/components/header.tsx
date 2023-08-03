import { cn } from "@/lib/utils"

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string | null
  size?: "default" | "sm"
}

export function Header({
  title,
  description,
  size = "default",
  className,
  ...props
}: HeaderProps) {
  return (
    <div className={cn("grid gap-1", className)} {...props}>
      <h1
        className={cn(
          "line-clamp-1 text-3xl font-bold tracking-tight",
          size === "default" && "md:text-4xl"
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "line-clamp-2 text-muted-foreground",
            size === "default" && "text-lg"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
