import * as React from "react"

interface UseClickOutsideProps {
  ref: React.RefObject<HTMLElement>
  handler: (event: MouseEvent | TouchEvent) => void
}

export function useClickOutside({ ref, handler }: UseClickOutsideProps) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current
      if (!el || el.contains((event?.target as Node) || null)) {
        return
      }
      handler(event)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}
