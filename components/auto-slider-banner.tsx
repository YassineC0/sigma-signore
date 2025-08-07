"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const images = [
  "https://64.media.tumblr.com/db8472cfbb89a155148003b053d5f3de/4d6d987e0cee7307-8e/s400x225/158142e8e876044a6191733a02f6ee5ac1643b58.gif",
  "https://i.pinimg.com/originals/14/f4/35/14f435eaaf8d107cca5055ce150eaf47.gif",
]

export function AutoSliderBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const handleShopClick = () => {
    const productSection = document.getElementById("product-section")
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      id="hero"
      ref={sectionRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {images.map((src, index) => (
        <div
          key={src}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: index === currentIndex ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={`Banner ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(4rem, 9vw, 8rem)", // Responsive huge text
            fontWeight: "900",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "24px",
            letterSpacing: "-0.02em",
            lineHeight: "0.9",
            textShadow: "4px 4px 8px rgba(0, 0, 0, 0.8)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(50px) scale(0.8)",
            transition: "all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transitionDelay: "0.2s",
          }}
        >
          L3aouni Style
        </h1>
        <p
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2rem)", // Responsive large subtitle
            color: "#e5e7eb",
            textAlign: "center",
            marginBottom: "48px",
            fontWeight: "300",
            letterSpacing: "0.05em",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            transitionDelay: "0.8s",
          }}
        >
          Elevate Your Style
        </p>
        <Button
          onClick={handleShopClick}
          style={{
            backgroundColor: "transparent",
            border: "3px solid white",
            color: "white",
            padding: "16px 48px",
            fontSize: "18px",
            fontWeight: "600",
            borderRadius: "8px",
            cursor: "pointer",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            transition: "all 0.3s ease",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "1.4s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "white"
            e.currentTarget.style.color = "black"
            e.currentTarget.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent"
            e.currentTarget.style.color = "white"
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          SHOP
        </Button>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes textGlow {
          0%, 100% {
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
          }
          50% {
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 255, 255, 0.3);
          }
        }

        h1 {
          animation: ${isVisible ? "textGlow 3s ease-in-out infinite" : "none"};
        }

        @media (max-width: 768px) {
          h1 {
            font-size: clamp(3rem, 10vw, 6rem) !important;
          }
          p {
            font-size: clamp(1.2rem, 3vw, 2rem) !important;
          }
        }
      `}</style>
    </div>
  )
}
