"use client"

import { useState, useEffect, useRef } from "react"
import { useProducts } from "@/hooks/useProducts"
import Link from "next/link"
import { ProductCard } from "./product-card" // Import the new ProductCard

export function ModernBestSellers() {
  const { products, loading, error } = useProducts({ featured: true, limit: 8 })
  const [isMobile, setIsMobile] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer || products.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.getAttribute("data-index") || "0", 10)
            setActiveIndex(index)
          }
        })
      },
      {
        root: scrollContainer,
        rootMargin: "0px",
        threshold: 0.8, // Adjust threshold as needed for when an item is considered "active"
      },
    )

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item)
    })

    return () => {
      itemRefs.current.forEach((item) => {
        if (item) observer.unobserve(item)
      })
    }
  }, [products]) // Re-run observer setup when products change

  const scrollToItem = (index: number) => {
    const item = itemRefs.current[index]
    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }

  if (loading) {
    return (
      <section
        style={{
          width: "100%",
          padding: "80px 0",
          backgroundColor: "var(--background)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <div style={{ fontSize: "18px", color: "var(--muted-foreground)" }}>Chargement des meilleures ventes...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        style={{
          width: "100%",
          padding: "80px 0",
          backgroundColor: "var(--background)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <div style={{ fontSize: "18px", color: "var(--destructive)" }}>
            Erreur de chargement des meilleures ventes: {error.message}
          </div>
        </div>
      </section>
    )
  }

  const bestSellers = products

  return (
    <section
      id="best-sellers-section"
      style={{
        width: "100%",
        padding: "80px 0",
        backgroundColor: "var(--background)",
        backgroundImage: 'url("/best-sellers-bg.png")', // Background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // Optional: for parallax effect
        color: "var(--foreground)", // Ensure text is visible on background
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "32px" : "64px",
            fontWeight: "800",
            textAlign: "center",
            color: "var(--foreground)", // Black text
            marginBottom: "64px",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          NOS <span style={{ color: "var(--primary)" }}>MEILLEURES VENTES</span> {/* Primary color for highlight */}
        </h2>

        {bestSellers.length > 0 ? (
          <>
            {isMobile ? (
              // Mobile: 2-column grid layout
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {bestSellers.map((product, index) => (
                  <div key={product.id}>
                    <ProductCard product={product} index={index} isVisible={true} isMobile={isMobile} />
                  </div>
                ))}
              </div>
            ) : (
              // Desktop: Keep the existing horizontal slider
              <>
                <div
                  ref={scrollContainerRef}
                  style={{
                    display: "flex",
                    overflowX: "scroll",
                    scrollSnapType: "x mandatory",
                    WebkitOverflowScrolling: "touch",
                    scrollbarWidth: "none", // For Firefox
                    msOverflowStyle: "none", // For IE/Edge
                    paddingBottom: "20px", // Space for dots
                    gap: "32px",
                  }}
                  className="[&::-webkit-scrollbar]:hidden" // For Webkit browsers
                >
                  {bestSellers.map((product, index) => (
                    <div
                      key={product.id}
                      ref={(el) => (itemRefs.current[index] = el)}
                      data-index={index}
                      style={{
                        flex: "0 0 auto",
                        width: "calc(25% - 24px)",
                        scrollSnapAlign: "start",
                      }}
                    >
                      <ProductCard product={product} index={index} isVisible={true} isMobile={isMobile} />
                    </div>
                  ))}
                </div>
                {bestSellers.length > 0 && !isMobile && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "20px",
                    }}
                  >
                    {bestSellers.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => scrollToItem(index)}
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: activeIndex === index ? "#1f2937" : "#d1d5db",
                          border: "none",
                          cursor: "pointer",
                          transition: "background-color 0.3s ease",
                        }}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--muted-foreground)",
              fontSize: "18px",
            }}
          >
            Aucun produit en vedette trouvé pour le moment.
          </p>
        )}

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <button
              style={{
                backgroundColor: "white",
                color: "#1f2937", // Dark text
                border: "1px solid #e5e7eb", // Subtle border
                padding: "16px 40px", // Adjusted padding
                fontSize: "18px",
                fontWeight: "600", // Adjusted font weight
                borderRadius: "9999px", // Fully rounded
                textTransform: "none", // No uppercase
                letterSpacing: "normal", // Normal letter spacing
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6" // Light gray on hover
                e.currentTarget.style.transform = "scale(1.02)"
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.15)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white"
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              Explorer Plus
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
