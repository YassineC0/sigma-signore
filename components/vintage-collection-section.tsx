"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

export function VintageCollectionSection() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [])

  return (
    <section className="relative w-full overflow-hidden">
      {isDesktop ? (
        // Desktop image - maintains aspect ratio
        <div className="relative w-full aspect-[1366/1200]">
          <Image
            src="/imagepc.png"
            alt="Vintage collection background for desktop"
            fill
            style={{ objectFit: "contain" }}
            quality={100}
            priority
          />
        </div>
      ) : (
        // Mobile image - fixed height
        <div className="relative h-[600px]">
          <Image
            src="/image.png"
            alt="Vintage collection background for mobile"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            priority
          />
        </div>
      )}
    </section>
  )
}
