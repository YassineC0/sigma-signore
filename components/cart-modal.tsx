"use client"

import { useState, useEffect } from "react" // Import useEffect
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, X } from "lucide-react"

export function CartModal() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, getTotalPrice } = useCart()
  const [isMounted, setIsMounted] = useState(false)
  const [screenWidth, setScreenWidth] = useState(0)

  useEffect(() => {
    setIsMounted(true)
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth)
    }

    updateScreenWidth()
    window.addEventListener("resize", updateScreenWidth)

    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      window.removeEventListener("resize", updateScreenWidth)
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isMounted || !isOpen) {
    return null
  }

  const isMobile = screenWidth <= 768
  const subtotal = getTotalPrice()

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
        onClick={() => setIsOpen(false)}
      />

      {/* Cart Modal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: isMobile ? "100%" : "32rem",
          maxWidth: isMobile ? "100%" : "100vw",
          boxSizing: "border-box",
          backgroundColor: "white",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "16px" : "24px",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          overflowX: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "2px solid #f3f4f6",
            paddingBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "18px" : "24px",
              fontWeight: "800",
              color: "#1f2937",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Panier ({items.length})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "transparent",
              color: "#6b7280",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6"
              e.currentTarget.style.color = "#374151"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = "#6b7280"
            }}
          >
            <X size={isMobile ? 20 : 24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: "16px",
            minHeight: 0,
          }}
        >
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 16px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <span style={{ fontSize: "24px" }}>🛒</span>
              </div>
              <p style={{ color: "#6b7280", fontSize: "16px", marginBottom: "16px" }}>Votre panier est vide</p>
              <Button
                onClick={() => setIsOpen(false)}
                style={{
                  backgroundColor: "#2A555A", // Changed from yellow
                  color: "white", // Changed for better contrast
                  fontWeight: "700",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1F4044" // Darker green on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2A555A" // Back to original green
                }}
              >
                Continuer vos achats
              </Button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {items.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedSize || "no-size"}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "8px" : "12px",
                    padding: isMobile ? "12px" : "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    transition: "all 0.3s ease",
                    minWidth: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f5f9"
                    e.currentTarget.style.borderColor = "#2A555A" // Changed from yellow
                    e.currentTarget.style.transform = "translateY(-1px)"
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa"
                    e.currentTarget.style.borderColor = "#e5e7eb"
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  {/* Product Image */}
                  <div
                    style={{
                      position: "relative",
                      width: isMobile ? "60px" : "70px",
                      height: isMobile ? "60px" : "70px",
                      flexShrink: 0,
                      borderRadius: "6px",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <Image
                      src={item.image1 || "/placeholder.svg?height=70&width=70"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes={isMobile ? "60px" : "70px"}
                    />
                  </div>
                  {/* Product Details */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: "700",
                        color: "#1f2937",
                        fontSize: isMobile ? "14px" : "16px",
                        marginBottom: "4px",
                        lineHeight: "1.3",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                    {item.selectedSize && (
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginBottom: "6px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Taille: {item.selectedSize}
                      </p>
                    )}
                    <p
                      style={{
                        color: "#2A555A", // Changed from yellow
                        fontSize: isMobile ? "16px" : "18px",
                        fontWeight: "800",
                        marginBottom: "8px",
                      }}
                    >
                      {item.price.toFixed(2)} DHS
                    </p>

                    {/* Quantity Controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: item.quantity <= 1 ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            opacity: item.quantity <= 1 ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (item.quantity > 1) {
                              e.currentTarget.style.backgroundColor = "#f3f4f6"
                              e.currentTarget.style.borderColor = "#2A555A" // Changed from yellow
                              e.currentTarget.style.transform = "scale(1.05)"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (item.quantity > 1) {
                              e.currentTarget.style.backgroundColor = "#ffffff"
                              e.currentTarget.style.borderColor = "#d1d5db"
                              e.currentTarget.style.transform = "scale(1)"
                            }
                          }}
                        >
                          <Minus size={14} color={item.quantity <= 1 ? "#9ca3af" : "#374151"} />
                        </button>

                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "700",
                            color: "#1f2937",
                            minWidth: "20px",
                            textAlign: "center",
                            padding: "2px 4px",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "4px",
                          }}
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f3f4f6"
                            e.currentTarget.style.borderColor = "#2A555A" // Changed from yellow
                            e.currentTarget.style.transform = "scale(1.05)"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#ffffff"
                            e.currentTarget.style.borderColor = "#d1d5db"
                            e.currentTarget.style.transform = "scale(1)"
                          }}
                        >
                          <Plus size={14} color="#374151" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{
                          padding: "6px",
                          borderRadius: "4px",
                          border: "none",
                          backgroundColor: "#E6F0ED", // Light green variation
                          color: "#2A555A", // Dark green
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#D4E0DD" // Darker light green
                          e.currentTarget.style.transform = "scale(1.1)"
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(42, 85, 90, 0.3)" // Green shadow
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#E6F0ED" // Back to original light green
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.boxShadow = "none"
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        {items.length > 0 && (
          <div
            style={{
              borderTop: "2px solid #f3f4f6",
              paddingTop: "16px",
              marginTop: "auto",
              backgroundColor: "#ffffff",
              flexShrink: 0,
            }}
          >
            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                padding: "12px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                border: "2px solid #2A555A", // Changed from yellow
                boxShadow: "0 2px 8px rgba(42, 85, 90, 0.2)", // Green shadow
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "800",
                  color: "#1f2937",
                  textTransform: "uppercase",
                }}
              >
                TOTAL:
              </span>
              <span
                style={{
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: "800",
                  color: "#2A555A", // Changed from yellow
                }}
              >
                {subtotal.toFixed(2)} DHS
              </span>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" passHref>
              <Button
                onClick={() => setIsOpen(false)}
                style={{
                  width: "100%",
                  backgroundColor: "#2A555A", // Changed from dark teal
                  color: "white", // Changed for better contrast
                  border: "none",
                  padding: isMobile ? "14px 16px" : "16px 20px",
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "800",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 4px 12px rgba(42, 85, 90, 0.3)", // Green shadow
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#1F4044" // Darker green on hover
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(42, 85, 90, 0.4)" // Darker green shadow
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#2A555A" // Back to original green
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(42, 85, 90, 0.3)" // Original green shadow
                }}
              >
                Commander
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
