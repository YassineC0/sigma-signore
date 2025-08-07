"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ProductCard({
  product,
  index,
  isVisible,
  isMobile,
}: {
  product: any
  index: number
  isVisible: boolean
  isMobile: boolean
}) {
  const { addToCart } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Use mainImage from API (first color variant image) and other product images
  const images = [
    product.mainImage || product.image1,
    product.image2,
    product.image3,
    product.image4
  ].filter(Boolean)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: "all 0.5s ease",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div
        style={{
          backgroundColor: "var(--background)",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = "translateY(-8px)"
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.15)"
          }
        }}
        onMouseLeave={(e) => {
          if (!isMobile) {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
          }
        }}
      >
        {/* Product Image Slider */}
        <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <div
            style={{
              position: "relative",
              aspectRatio: "1",
              overflow: "hidden",
              backgroundColor: "var(--muted)",
            }}
          >
            {images.length > 0 ? (
              <Image
                src={images[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                sizes={isMobile ? "(max-width: 768px) 50vw" : "25vw"}
              />
            ) : (
              <Image
                src="/placeholder.svg"
                alt="Placeholder"
                fill
                style={{ objectFit: "cover" }}
                sizes={isMobile ? "(max-width: 768px) 50vw" : "25vw"}
              />
            )}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    prevImage()
                  }}
                  style={{
                    position: "absolute",
                    left: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--foreground)",
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault()
                    nextImage()
                  }}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--foreground)",
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </Link>
        {/* Product Info */}
        <div style={{ padding: isMobile ? "12px" : "20px" }}>
          <p
            style={{
              fontSize: "10px",
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: "500",
              marginBottom: "6px",
            }}
          >
            LUXURY CLOTHES
          </p>
          <h3
            style={{
              fontSize: isMobile ? "14px" : "18px",
              fontWeight: "700",
              color: "var(--foreground)",
              marginBottom: isMobile ? "8px" : "12px",
              lineHeight: "1.3",
            }}
          >
            {product.name}
          </h3>
          {/* Price with promotion handling */}
          <div style={{ marginBottom: isMobile ? "12px" : "16px" }}>
            {product.is_on_promotion && product.promotion_price ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <p style={{ 
                  fontSize: isMobile ? "16px" : "20px", 
                  fontWeight: "700", 
                  color: "#ff4444",
                  margin: 0
                }}>
                  {product.promotion_price.toFixed(2)} DHS
                </p>
                <p style={{ 
                  fontSize: isMobile ? "12px" : "14px", 
                  textDecoration: "line-through", 
                  color: "var(--muted-foreground)",
                  margin: 0
                }}>
                  {product.price.toFixed(2)} DHS
                </p>
                <span style={{ 
                  backgroundColor: "#ff4444", 
                  color: "white", 
                  fontSize: "10px", 
                  padding: "2px 6px", 
                  borderRadius: "3px",
                  fontWeight: "600"
                }}>
                  PROMO
                </span>
              </div>
            ) : (
              <p style={{
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "700",
                color: "var(--foreground)",
                margin: 0
              }}>
                {product.price.toFixed(2)} DHS
              </p>
            )}
          </div>
          <Button
            onClick={() => addToCart(product)}
            style={{
              width: "100%",
              backgroundColor: "#2A555A",
              color: "white",
              border: "none",
              padding: isMobile ? "10px 12px" : "12px 16px",
              fontSize: isMobile ? "12px" : "14px",
              fontWeight: "700",
              borderRadius: "0",
              cursor: "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--foreground)"
              e.currentTarget.style.color = "var(--background)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#2A555A"
              e.currentTarget.style.color = "white"
            }}
          >
            Ajouter au panier
          </Button>
        </div>
      </div>
    </div>
  )
}
