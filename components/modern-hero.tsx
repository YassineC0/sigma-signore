"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

// Global video cache to persist across component mounts
let globalVideoCache: HTMLVideoElement | null = null
let globalVideoLoaded = false

export function ModernHero() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(globalVideoLoaded)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    setIsMounted(true)
    window.addEventListener("resize", checkMobile)

    // Animate text and buttons
    const textTimer = setTimeout(() => setShowText(true), 500)
    const buttonTimer = setTimeout(() => setShowButtons(true), 1000)

    return () => {
      window.removeEventListener("resize", checkMobile)
      clearTimeout(textTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // If we have a global cached video, use its state
    if (globalVideoCache && globalVideoLoaded) {
      setVideoLoaded(true)
      // Copy the cached video's current time and play state
      video.currentTime = globalVideoCache.currentTime
      if (!globalVideoCache.paused) {
        video.play().catch((error) => {
          console.log("Video play failed:", error)
        })
      }
      return
    }

    const handleCanPlay = () => {
      setVideoLoaded(true)
      globalVideoLoaded = true
      globalVideoCache = video
      
      // Auto-play with error handling
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Video autoplay failed:", error)
          setVideoError(true)
        })
      }
    }

    const handleError = () => {
      setVideoError(true)
      globalVideoLoaded = false
    }

    const handleLoadedData = () => {
      setVideoLoaded(true)
      globalVideoLoaded = true
      globalVideoCache = video
    }

    // Only add listeners if video isn't already loaded globally
    if (!globalVideoLoaded) {
      video.addEventListener("canplay", handleCanPlay)
      video.addEventListener("error", handleError)
      video.addEventListener("loadeddata", handleLoadedData)
      
      // REMOVED: video.load() - This was causing re-downloads!
      // The browser will automatically load based on preload attribute
    } else {
      // Video is already cached, just set it as loaded
      setVideoLoaded(true)
    }

    return () => {
      if (!globalVideoLoaded) {
        video.removeEventListener("canplay", handleCanPlay)
        video.removeEventListener("error", handleError)
        video.removeEventListener("loadeddata", handleLoadedData)
      }
    }
  }, [isMounted])

  const handleShopClick = () => {
    if (typeof window !== "undefined") {
      const productSection = document.getElementById("best-sellers-section")
      if (productSection) {
        productSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleVideoClick = () => {
    const video = videoRef.current
    if (video && video.paused) {
      video.play().catch((error) => {
        console.log("Manual video play failed:", error)
      })
    }
  }

  if (!isMounted) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          backgroundColor: "white",
          paddingTop: "70px",
        }}
      />
    )
  }

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "70px",
        boxSizing: "border-box",
      }}
    >
      {/* Fallback Image for when video fails or doesn't load */}
      {(!videoLoaded || videoError) && (
        <img
          src="/hero-fallback.png"
          alt="Hero Background"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onClick={handleVideoClick}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          minWidth: "100%",
          minHeight: "100%",
          width: "auto",
          height: "auto",
          transform: "translate(-50%, -50%)",
          zIndex: videoLoaded && !videoError ? 0 : -1,
          objectFit: "cover",
          opacity: videoLoaded && !videoError ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <source src="/herox.mp4" type="video/mp4" />
        <source src="/herox.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for text readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          color: "white",
          padding: "0 16px",
          maxWidth: "900px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 70px)",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? "48px" : "96px",
            fontWeight: "800",
            lineHeight: "1.1",
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            opacity: showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            transitionDelay: "0.2s",
          }}
        >
          Luxury <br /> Clothes
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            marginTop: "40px",
            opacity: showButtons ? 1 : 0,
            transform: showButtons ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            transitionDelay: "0.5s",
            width: isMobile ? "100%" : "auto",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleShopClick}
            style={{
              backgroundColor: "white",
              color: "black",
              border: "none",
              padding: "18px 40px",
              fontSize: "18px",
              fontWeight: "700",
              borderRadius: "0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
              width: isMobile ? "80%" : "auto",
              maxWidth: "300px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(42, 85, 90, 0.8)"
              e.currentTarget.style.transform = "scale(1.05)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            Acheter Maintenant
          </button>
          <Link
            href="#contact-section"
            style={{ textDecoration: "none", width: isMobile ? "80%" : "auto", maxWidth: "300px" }}
          >
            <button
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "2px solid white",
                padding: "18px 40px",
                fontSize: "18px",
                fontWeight: "700",
                borderRadius: "0",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: "pointer",
                transition: "all 0.3s ease",
                width: "100%",
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
              Nous Contacter
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
