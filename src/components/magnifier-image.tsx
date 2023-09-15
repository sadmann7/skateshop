"use client"
import Image from "next/image"
import type { ComponentProps } from "react"
import { useState } from "react"
 
interface Props extends ComponentProps<typeof Image> {
// scale of zoom box
  size?: number
// how much  zoom
  zoom?: number
}
export default function MagnifierImage({ size, zoom, ...props }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const zoomValue = zoom || 3
  const sizeValue = size || 200

  const [isHovered, setIsHovered] = useState(false)
  const handleMouseHover = (e: any) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });
    setCursorPosition({ x: e.pageX - left, y: e.pageY - top });

  };

 

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
        
        className={` h-full w-full  transition-all duration-500`}
      
      />

      {showMagnifier  && (
        <div
          className="absolute border overflow-hidden border-gray-300 shadow-lg "
          style={{
            position: "absolute",
            left: `${cursorPosition.x - 100}px`,
            top: `${cursorPosition.y - 100}px`,
            pointerEvents: "none",
            width: `${sizeValue}px` ,
            height: `${sizeValue}px` ,
            backgroundRepeat: "no-repeat",
            zIndex: 999,
          }}
        >
           
             <Image
                     {...props}
                     alt="Image"
                     style={{
                       objectPosition: `${position.x}% ${position.y}%`,
                       scale: zoomValue,
                       zIndex: 999,
                     }}
                     className={` h-full w-full object-cover transition-all duration-500`}
                   
                   />
          </div>
      )}
    </div>
  )
}

