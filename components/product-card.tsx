"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product, ProductColor } from "@/types/product"

// 20 predefined colors (copied from admin/page.tsx for consistency)
const PREDEFINED_COLORS: ProductColor[] = [
  { name: "Rouge", hex: "#FF0000" },
  { name: "Bleu", hex: "#0000FF" },
  { name: "Vert", hex: "#008000" },
  { name: "Jaune", hex: "#FFFF00" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Violet", hex: "#800080" },
  { name: "Rose", hex: "#FFC0CB" },
  { name: "Marron", hex: "#A52A2A" },
  { name: "Noir", hex: "#000000" },
  { name: "Blanc", hex: "#FFFFFF" },
  { name: "Gris", hex: "#808080" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Marine", hex: "#000080" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Bordeaux", hex: "#800020" },
  { name: "Kaki", hex: "#F0E68C" },
  { name: "Corail", hex: "#FF7F50" },
  { name: "Lavande", hex: "#E6E6FA" },
  { name: "Menthe", hex: "#98FB98" },
  { name: "Crème", hex: "#FFFDD0" },
]

export function ProductCard({
  product,
  index,
  isVisible,
  isMobile,
  showAddToCartButton = true, // New prop to control button visibility
}: {
  product: Product
  index: number
  isVisible: boolean
  isMobile: boolean
  showAddToCartButton?: boolean // Optional prop
}) {
  const [hovered, setHovered] = useState(false)

  // Determine the main image for the product card
  const mainProductImage = product.mainImage || product.image1 || "/placeholder.svg"

  // Get unique colors from product variants, mapping to their hex codes
  const availableColors = product.variants
    ? Array.from(new Set(product.variants.filter((v) => v.color).map((v) => v.color!))).map((colorName) => {
        const predefinedColor = PREDEFINED_COLORS.find((c) => c.name === colorName)
        return {
          name: colorName,
          hex: predefinedColor ? predefinedColor.hex : "#CCCCCC", // Fallback to grey if hex not found
        }
      })
    : []

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "8px", // Slightly less rounded
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease", // Faster transition
        transform: hovered ? "scale(1.02) translateY(-3px)" : "scale(1) translateY(0)", // Less aggressive hover
        opacity: isVisible ? 1 : 0,
        boxShadow: hovered ? "0 10px 20px rgba(0, 0, 0, 0.1)" : "0 4px 8px rgba(0, 0, 0, 0.05)", // Lighter shadow
        transitionDelay: `${index * 50}ms`, // Staggered animation
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #e5e7eb", // Subtle border
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
        <div
          style={{
            position: "relative",
            aspectRatio: "1",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Image
            src={mainProductImage || "/placeholder.svg"}
            alt={product.name}
            fill
            style={{
              objectFit: "cover",
              transition: "all 0.3s ease",
              transform: hovered ? "scale(1.03)" : "scale(1)", // Less aggressive image zoom
            }}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 20vw"
          />
        </div>
      </Link>

      <div
        style={{
          padding: isMobile ? "12px" : "16px", // Reduced padding
          backgroundColor: "white",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: isMobile ? "14px" : "16px", // Smaller font size for mobile
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: isMobile ? "4px" : "8px", // Reduced margin
              lineHeight: "1.3",
            }}
          >
            {product.name}
          </h3>
          {product.is_on_promotion && product.promotion_price ? (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <p style={{ fontSize: isMobile ? "16px" : "18px", color: "#1f2937", fontWeight: "700", margin: 0 }}>
                {product.promotion_price} DHS
              </p>
              <p
                style={{
                  fontSize: isMobile ? "12px" : "14px",
                  color: "#6b7280",
                  textDecoration: "line-through",
                  margin: 0,
                }}
              >
                {product.price} DHS
              </p>
              <span
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  fontSize: "8px", // Smaller promo tag
                  padding: "1px 4px",
                  borderRadius: "2px",
                  fontWeight: "600",
                }}
              >
                PROMO
              </span>
            </div>
          ) : (
            <p style={{ fontSize: isMobile ? "16px" : "18px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
              {product.price} DHS
            </p>
          )}
        </div>

        {availableColors.length > 0 && (
          <div style={{ marginTop: isMobile ? "8px" : "12px" }}>
            <p style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px" }}>Couleurs:</p> {/* Shorter text */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {" "}
              {/* Smaller gap */}
              {availableColors.map((color) => (
                <div
                  key={color.name}
                  style={{
                    width: "14px", // Smaller color swatch
                    height: "14px",
                    borderRadius: "50%",
                    backgroundColor: color.hex,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.05)",
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: isMobile ? "16px" : "20px" }}>
          <Link href={`/product/${product.id}`} style={{ textDecoration: "none", width: "100%" }}>
            <button
              style={{
                backgroundColor: "transparent",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
                padding: isMobile ? "10px 16px" : "12px 20px", // Smaller padding
                fontSize: isMobile ? "12px" : "14px", // Smaller font size
                fontWeight: "600",
                borderRadius: "9999px",
                textTransform: "none",
                letterSpacing: "normal",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)", // Lighter shadow
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f3f4f6"
                e.currentTarget.style.transform = "scale(1.01)"
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.05)"
              }}
            >
              Voir le produit
            </button>
          </Link>
          
        </div>
      </div>
    </div>
  )
}
