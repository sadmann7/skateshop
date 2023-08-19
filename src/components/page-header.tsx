import { cva, type VariantProps } from "class-variance-authority"
import Balancer from "react-wrap-balancer"

import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-bold leading-tight tracking-tighter lg:leading-[1.1]",
  {
    variants: {
      size: {
        default: "text-3xl md:text-4xl",
        sm: "text-2xl md:text-3xl",
        lg: "text-4xl md:text-5xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const descriptionVariants = cva("text-muted-foreground max-w-[750px]", {
  variants: {
    size: {
      default: "text-base sm:text-lg",
      sm: "text-sm sm:text-base",
      lg: "text-lg sm:text-xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

interface PageHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headingVariants>,
    VariantProps<typeof descriptionVariants> {
  title: string
  description?: string | null
  descriptionAs?: React.ElementType
  balancedTitle?: boolean
  balacedDescription?: boolean
}

const PageHeader = ({
  title,
  description,
  descriptionAs = "h2",
  className,
  size,
  balancedTitle = false,
  balacedDescription = true,
  ...props
}: PageHeaderProps) => {
  const Title = balancedTitle ? Balancer : "h1"
  const Description = balacedDescription ? Balancer : "h2"

  return (
    <div className={cn("grid gap-1", className)} {...props}>
      <Title as="h1" className={cn(headingVariants({ size }))}>
        {title}
      </Title>
      {description && (
        <Description
          as={descriptionAs}
          className={cn(descriptionVariants({ size }))}
        >
          {description}
        </Description>
      )}
    </div>
  )
}

interface PageHeaderHeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {}

function PageHeaderHeading({
  className,
  size,
  ...props
}: PageHeaderHeadingProps) {
  return <h1 className={cn(headingVariants({ size, className }))} {...props} />
}

interface PageHeaderDescriptionProps
  extends React.ComponentProps<typeof Balancer>,
    VariantProps<typeof descriptionVariants> {}

function PageHeaderDescription({
  className,
  size,
  ...props
}: PageHeaderDescriptionProps) {
  return (
    <Balancer
      as="p"
      className={cn(descriptionVariants({ size, className }))}
      {...props}
    />
  )
}

export { PageHeader, PageHeaderDescription, PageHeaderHeading }
