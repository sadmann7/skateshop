import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  description?: string
  size?: "default" | "sm"
}

export function Header({ title, description, size = "default" }: HeaderProps) {
  return (
    <div className="grid gap-1">
      <h1
        className={cn(
          "text-3xl font-bold tracking-tight",
          size === "default" && "md:text-4xl"
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "text-muted-foreground",
            size === "default" && "text-lg"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}
