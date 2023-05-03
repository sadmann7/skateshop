interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="grid gap-1">
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      {description ? (
        <p className="text-lg text-muted-foreground">{description}</p>
      ) : null}
    </div>
  )
}
