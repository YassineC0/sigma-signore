"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Product } from "@/types/product"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductSliderCardProps {
  product: Product
  index: number
  isVisible: boolean
  addToCart: (product: Product) => void
  isMobile: boolean
}

export function ProductSliderCard({ product, index, isVisible, addToCart, isMobile }: ProductSliderCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Use mainImage from API (first color variant image) and other product images
  const images = [
    product.mainImage || product.image1,
    product.image2
  ].filter(Boolean) as string[]

  // Fallback to placeholder if no images are available
  const displayImages = images.length > 0 ? images : ["/placeholder.svg?height=400&width=400&text=No Image"]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + displayImages.length) % displayImages.length)
  }

  // Ensure image paths are correct (leading slash for relative paths)
  const getImageUrl = (path: string) => {
    if (path && !path.startsWith("/") && !path.startsWith("http")) {
      return `/${path}`
    }
    return path
  }

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: "all 0.5s ease",
        transitionDelay: `${index * 100}ms`,
        position: "relative",
        backgroundColor: "var(--card)",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
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
      <Link href={`/product/${product.id}`} style={{ textDecoration: "none", flexGrow: 1, position: "relative" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1",
            overflow: "hidden",
            backgroundColor: "var(--muted)",
          }}
        >
          <Image
            src={getImageUrl(displayImages[currentImageIndex]) || "/placeholder.svg"}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            fill
            style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
            sizes={isMobile ? "(max-width: 768px) 100vw" : "25vw"}
            priority={index < 4}
          />
          {/* Slider Navigation Buttons */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  prevImage()
                }}
                style={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  nextImage()
                }}
                style={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  zIndex: 10,
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.7)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)")}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          {/* Product Info Overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
              padding: "20px",
              color: "white",
              textAlign: "left",
              zIndex: 5,
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "16px" : "20px",
                fontWeight: "700",
                marginBottom: "4px",
                lineHeight: "1.3",
              }}
            >
              {product.name}
            </h3>
            {/* Price with promotion handling */}
            {product.is_on_promotion && product.promotion_price ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <p style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "700", color: "#ff4444" }}>
                  {product.promotion_price.toFixed(2)} DHS
                </p>
                <p style={{ fontSize: isMobile ? "14px" : "16px", textDecoration: "line-through", opacity: 0.8 }}>
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
              <p style={{ fontSize: isMobile ? "18px" : "24px", fontWeight: "700" }}>
                {product.price.toFixed(2)} DHS
              </p>
            )}
          </div>
        </div>
      </Link>
      {/* Action Button */}
      <div style={{ padding: "16px", textAlign: "center" }}>
        <Button
          onClick={(e) => {
            e.preventDefault()
            addToCart(product)
          }}
          style={{
            width: "100%",
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            padding: "12px 16px",
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "700",
            borderRadius: "0",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--foreground)"
            e.currentTarget.style.transform = "scale(1.02)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary)"
            e.currentTarget.style.transform = "scale(1)"
          }}
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  )
}
