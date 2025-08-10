"use client"
import { useState, useEffect } from "react" // Import useEffect

import Image from "next/image"
import { Tag, Truck } from "lucide-react"

export function PromotionSection() {
  const [isMobile, setIsMobile] = useState(false)

  // Move window-dependent logic to useEffect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, []) // Empty dependency array means this runs once on mount

  const handleShopClick = () => {
    if (typeof window !== "undefined") {
      const productSection = document.getElementById("best-sellers-section")
      if (productSection) {
        productSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#f8f9fa",
        padding: isMobile ? "40px 16px" : "60px 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Section Title */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2
            style={{
              fontSize: isMobile ? "28px" : "48px",
              fontWeight: "800",
              color: "#1f2937",
              margin: "0 0 16px 0",
              fontFamily: "'Inter', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            OFFRES <span style={{ color: "#000000" }}>SPÉCIALES</span>
          </h2>
          <p
            style={{
              fontSize: isMobile ? "16px" : "20px",
              color: "#6b7280",
              fontWeight: "300",
              lineHeight: "1.6",
              margin: 0,
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Profitez de nos promotions exceptionnelles
          </p>
        </div>

        {/* Promotion Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "40px",
            alignItems: "center",
          }}
        >
          {/* Promotion Image - Place your image here */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: isMobile ? "300px" : "400px",
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              border: "3px #2A555A", // Changed color
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          >
            {/*
              To add your image, replace the Image component below with your own.
              Example: <Image src="/path/to/your/image.jpg" alt="Promotion" fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 50vw" />
              Make sure your image is in the `public` folder or accessible via a URL.
            */}
            <Image
              src="/tshirts.jpg" // Placeholder image
              alt="Promotion"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Promotion Details */}
          <div>
            {/* T-Shirts & Polos Promotion */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "30px",
                marginBottom: "24px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                border: "2px solid #2A555A", // Changed color
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "700",
                  color: "#1f2937",
                  margin: "0 0 20px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Tag size={24} color="#2A555A" /> {/* Changed color */}
                T-SHIRTS & POLOS
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  <span style={{ color: "#2A555A" }}>🏷️</span>1 pièce : <span style={{ color: "#ef4444" }}>200 DH</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  <span style={{ color: "#2A555A" }}>🏷️</span>2 pièces : <span style={{ color: "#ef4444" }}>300 DH</span>
                  <span style={{ fontSize: "14px", color: "#6b7280", textDecoration: "line-through" }}>
                    (au lieu de 400 DH)
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  <span style={{ color: "#2A555A" }}>🏷️</span>3 pièces : <span style={{ color: "#ef4444" }}>400 DH</span>
                  <span style={{ fontSize: "14px", color: "#6b7280", textDecoration: "line-through" }}>
                    (au lieu de 600 DH)
                  </span>
                </div>
              </div>
            </div>

            {/* Pants Promotion */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                padding: "30px",
                marginBottom: "24px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                border: "2px solid #2A555A", // Changed color
              }}
            >
              <h3
                style={{
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: "700",
                  color: "#1f2937",
                  margin: "0 0 20px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Tag size={24} color="#2A555A" /> {/* Changed color */}
                PANTALONS
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  <span style={{ color: "#2A555A" }}>🏷️</span>1 pièce : <span style={{ color: "#ef4444" }}>250 DH</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: isMobile ? "16px" : "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                  }}
                >
                  <span style={{ color: "#2A555A" }}>🏷️</span>2 pièces : <span style={{ color: "#ef4444" }}>450 DH</span>
                  <span style={{ fontSize: "14px", color: "#6b7280", textDecoration: "line-through" }}>
                    (au lieu de 500 DH)
                  </span>
                </div>
              </div>
            </div>

            
            {/* Removed "Profiter des offres" button */}
          </div>
        </div>
      </div>
    </section>
  )
}
