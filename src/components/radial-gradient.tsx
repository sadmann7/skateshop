import { cn } from "@/lib/utils"

type Type = "circle" | "ellipse"

type Origin =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top left"
  | "top right"
  | "bottom left"
  | "bottom right"

interface RadialGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The type of radial gradient
   * @default circle
   * @type string
   */
  type?: Type
  /**
   * The color to transition from
   * @default #00000000
   * @type string
   * */
  from?: string

  /**
   * The color to transition to
   * @default #290A5C
   * @type string
   * */
  to?: string

  /**
   * The size of the gradient in pixels
   * @default 300
   * @type number
   * */
  size?: number

  /**
   * The origin of the gradient
   * @default center
   * @type string
   * */
  origin?: Origin
}

export function RadialGradient({
  type = "circle",
  from = "hsla(241, 41%, 62%, 0.3)",
  to = "hsla(0, 0%, 0%, 0)",
  size = 300,
  origin = "center",
  className,
}: RadialGradientProps) {
  const styles: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
    inset: 0,
    backgroundImage: `radial-gradient(${type} ${size}px at ${origin}, ${from}, ${to})`,
  }

  return <div className={cn(className)} style={styles} />
}
