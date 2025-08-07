"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function Logo() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show logo after splash screen
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        position: "relative",
        width: "96px",
        height: "96px",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 1s ease-in-out",
      }}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20sdfm-gDlxg0zxe6wVV9o5cISteykVa4LQhz.png"
        alt="SDFM 2520"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  )
}
