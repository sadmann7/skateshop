"use client"

import type { ComponentProps } from "react"
import * as React from "react"
import Image from "next/image"

interface MagnifierImageProps extends ComponentProps<typeof Image> {
  size?: number
  zoom?: number
}

export function MagnifierImage({
  size = 200,
  zoom = 3,
  ...props
}: MagnifierImageProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [showMagnifier, setShowMagnifier] = React.useState(false)
  const [cursorPosition, setCursorPosition] = React.useState({ x: 0, y: 0 })

  const handleMouseHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.pageX - left) / width) * 100
    const y = ((e.pageY - top) / height) * 100
    setPosition({ x, y })
    setCursorPosition({ x: e.pageX - left, y: e.pageY - top })
  }

  return (
    <div
      className="relative h-full w-full "
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseHover}
    >
      <Image
        {...props}
        alt="Image"
        className="h-full w-full  transition-all duration-500"
      />
      {showMagnifier && (
        <div
          className="absolute overflow-hidden border border-gray-300 shadow-lg "
          style={{
            position: "absolute",
            left: `${cursorPosition.x - 100}px`,
            top: `${cursorPosition.y - 100}px`,
            pointerEvents: "none",
            width: `${size}px`,
            height: `${size}px`,
            backgroundRepeat: "no-repeat",
            zIndex: 999,
          }}
        >
          <Image
            {...props}
            alt="Image"
            style={{
              objectPosition: `${position.x}% ${position.y}%`,
              scale: zoom,
              zIndex: 999,
            }}
            className={` h-full w-full object-cover transition-all duration-500`}
          />
        </div>
      )}
    </div>
  )
}
