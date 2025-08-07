"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function SplashScreen() {
  const [progress, setProgress] = useState(0)
  const [matrixText, setMatrixText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%"
    let interval: NodeJS.Timeout
    let matrixInterval: NodeJS.Timeout

    // Matrix text effect
    matrixInterval = setInterval(() => {
      const randomText = Array(8)
        .fill(0)
        .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join("")
      setMatrixText(randomText)
    }, 50)

    // Progress bar animation
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          clearInterval(matrixInterval)
          setTimeout(() => setIsComplete(true), 500)
          return 100
        }
        return prev + 2 // Faster loading
      })
    }, 50)

    return () => {
      clearInterval(interval)
      clearInterval(matrixInterval)
    }
  }, [])

  if (isComplete) {
    return null // Completely remove from DOM when complete
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999, // Higher z-index to ensure it's on top
        opacity: isComplete ? 0 : 1,
        transition: "opacity 0.5s ease-out",
      }}
    >
      <div style={{ position: "relative", width: "192px", height: "192px", marginBottom: "32px" }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20sdfm-gDlxg0zxe6wVV9o5cISteykVa4LQhz.png"
          alt="SDFM 2520"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      <div
        style={{
          fontFamily: "monospace",
          color: "white",
          marginBottom: "16px",
          height: "24px",
          fontSize: "16px",
        }}
      >
        {`LOADING_SYSTEM: ${matrixText}`}
      </div>

      <div
        style={{
          width: "256px",
          height: "4px",
          backgroundColor: "#1a1a1a",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "white",
            width: `${progress}%`,
            transition: "width 0.1s ease-out",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "8px",
          fontFamily: "monospace",
          fontSize: "14px",
          color: "white",
        }}
      >
        {`${progress}%`}
      </div>
    </div>
  )
}
