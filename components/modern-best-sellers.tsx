"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/hooks/useProducts"
import Link from "next/link"
import { ProductCard } from "./product-card" // Import the new ProductCard

export function ModernBestSellers() {
  const { products, loading, error } = useProducts({ featured: true, limit: 4 })
  const [visibleProducts, setVisibleProducts] = useState<boolean[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  // addToCart is now passed directly to ProductCard, no longer needed here
  // const { addToCart } = useCart()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (products.length > 0) {
      setVisibleProducts(new Array(products.length).fill(false))
      products.forEach((_, index) => {
        setTimeout(() => {
          setVisibleProducts((prev) => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }, index * 100)
      })
    }
  }, [products])

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

  const getGridColumns = () => {
    if (isMobile) {
      return "1fr" // 1 column on mobile
    }
    return "1fr 1fr 1fr 1fr" // 4 columns on desktop
  }

  return (
    <section
      id="best-sellers-section"
      ref={sectionRef}
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
            fontFamily: "'Fahkwang, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          NOS <span style={{ color: "var(--primary)" }}>MEILLEURES VENTES</span> {/* Primary color for highlight */}
        </h2>

        {bestSellers.length > 0 ? (
          <>
            {/* First Row - 4 products */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: getGridColumns(),
                gap: isMobile ? "24px" : "32px", // Increased gap for mobile
                marginBottom: "48px",
              }}
            >
              {bestSellers.slice(0, 4).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isVisible={visibleProducts[index]}
                  isMobile={isMobile}
                />
              ))}
            </div>

            {/* Second Row - 4 products (if available) */}
            {bestSellers.length > 4 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: getGridColumns(),
                  gap: isMobile ? "24px" : "32px",
                  marginBottom: "48px",
                }}
              >
                {bestSellers.slice(4, 8).map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index + 4}
                    isVisible={visibleProducts[index + 4]}
                    isMobile={isMobile}
                  />
                ))}
              </div>
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

        <div style={{ textAlign: "center" }}>
          <Link href="/products" style={{ textDecoration: "none" }}>
            <Button
              style={{
                backgroundColor: "#2A555A", // Black button
                color: "var(--primary-foreground)", // White text
                padding: "16px 32px",
                fontSize: "16px",
                fontWeight: "700",
                borderRadius: "0",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "all 0.3s ease",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--foreground)" // Lighter black on hover
                e.currentTarget.style.color = "var(--background)" // White text on hover
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)"
                e.currentTarget.style.color = "var(--primary-foreground)"
                e.currentTarget.style.transform = "scale(1)"
              }}
            >
              Voir Tout
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
