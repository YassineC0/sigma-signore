"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Star, ShoppingCart, Truck, Shield, RotateCcw, Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { useProductVariants } from "@/hooks/useProductVariants"
import { PhoneIcon as Whatsapp } from 'lucide-react'
import type { Product, ProductVariant, ProductColor } from "@/types/product"

// Predefined colors with hex values for display
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

// Helper functions (copied from CartContext for client-side use)
const isShirtOrPolo = (product: Product): boolean => {
  const name = product.name.toLowerCase()
  const category = product.category?.toLowerCase() || ""
  return (
    name.includes("t-shirt") ||
    name.includes("tshirt") ||
    name.includes("polo") ||
    category.includes("t-shirt") ||
    category.includes("polo") ||
    category.includes("shirt")
  )
}

const isPants = (product: Product): boolean => {
  const name = product.name.toLowerCase()
  const category = product.category?.toLowerCase() || ""
  return (
    name.includes("pantalon") ||
    name.includes("pants") ||
    name.includes("jean") ||
    name.includes("short") ||
    category.includes("pantalon") ||
    category.includes("pants") ||
    category.includes("short")
  )
}

export default function ProductPage() {
  const params = useParams()
  const { id } = params as { id: string }
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState<string | undefined>(undefined)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const { addToCart } = useCart()
  const { variants, loading: variantsLoading } = useProductVariants(id)

  // Get unique colors from variants that have stock in at least one size
  const availableColors = Array.from(new Set(
    variants
      .filter(v => v.color && v.stock_quantity > 0)
      .map(v => v.color!)
  ))

  // Get sizes for selected color
  const availableSizesForColor = selectedColor 
    ? variants.filter(v => v.color === selectedColor && v.stock_quantity > 0)
    : variants.filter(v => !v.color && v.stock_quantity > 0)

  // Get current variant based on selected color and size
  const selectedVariant = variants.find(v => 
    selectedColor 
      ? (v.color === selectedColor && v.size === selectedSize)
      : (!v.color && v.size === selectedSize)
  )

  // Determine overall stock status
  const isInStock = selectedVariant ? selectedVariant.stock_quantity > 0 : (product?.in_stock || false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) {
          throw new Error(`Erreur HTTP! statut: ${response.status}`)
        }
        const data = await response.json()
        setProduct(data)
        // Set initial main image from API (first color variant or image1)
        setMainImage(data.mainImage || data.image1 || "/placeholder.svg")
        
        // Pre-select first color if available
        if (data.variants && data.variants.length > 0) {
          const firstColorVariant = data.variants.find(v => v.color && v.image_url)
          if (firstColorVariant) {
            setSelectedColor(firstColorVariant.color)
          }
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  // Update main image when color is selected
  useEffect(() => {
    if (selectedColor) {
      const variantWithColorImage = variants.find(v => v.color === selectedColor && v.image_url)
      if (variantWithColorImage?.image_url) {
        setMainImage(variantWithColorImage.image_url)
      } else if (product?.image1) {
        setMainImage(product.image1)
      }
    } else if (product?.mainImage || product?.image1) {
      setMainImage(product.mainImage || product.image1)
    }
  }, [selectedColor, variants, product])

  // Reset size when color changes
  useEffect(() => {
    setSelectedSize("")
  }, [selectedColor])

  // Get hex color for display
  const getColorHex = (colorName: string): string => {
    const colorData = PREDEFINED_COLORS.find(c => c.name === colorName)
    return colorData?.hex || "#cccccc"
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "#1f2937",
          paddingTop: "120px",
        }}
      >
        Chargement du produit...
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "#ef4444",
          padding: "20px",
          textAlign: "center",
          paddingTop: "120px",
        }}
      >
        <h2>Erreur de chargement du produit</h2>
        <p>Erreur: {error}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "#6b7280",
          textAlign: "center",
          paddingTop: "120px",
        }}
      >
        <h2>Produit introuvable</h2>
        <p>Le produit que vous recherchez n'existe pas.</p>
      </div>
    )
  }

  // Determine if product is part of a promotion and get details
  let promotionDetails: string | null = null
  if (isShirtOrPolo(product)) {
    promotionDetails = "🏷 1 pièce : 200 DH | 🏷 2 pièces : 300 DH | 🏷 3 pièces : 400 DH"
  } else if (isPants(product)) {
    if (product.id === 7) {
      promotionDetails = "🏷 1 pièce : 259 DH | 🏷 2 pièces : 480 DH"
    } else {
      promotionDetails = "🏷 1 pièce : 250 DH | 🏷 2 pièces : 450 DH"
    }
  }

  const handleBuyViaWhatsAppClick = () => {
    if (availableColors.length > 0 && !selectedColor) {
      alert("Veuillez sélectionner une couleur")
      return
    }
    if (availableSizesForColor.length > 0 && !selectedSize) {
      alert("Veuillez sélectionner une taille")
      return
    }
    addToCart(product, selectedSize, selectedColor)
    router.push("/checkout")
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "120px 20px 80px",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "40px",
        alignItems: "flex-start",
      }}
    >
      <style jsx>{`
        @media (min-width: 768px) {
          div[style*="gridTemplateColumns: 1fr"] {
            grid-template-columns: 1fr 1fr;
            gap: 60px;
          }
        }
      `}</style>
      {/* Product Images */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1",
            maxHeight: "500px",
            overflow: "hidden",
            borderRadius: "8px",
            backgroundColor: "#f8f9fa",
          }}
        >
          <Image
            src={mainImage || "/placeholder.svg?height=600&width=600&query=product"}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "5px" }}>
          {product.image1 && (
            <div
              onClick={() => {
                setMainImage(product.image1)
                setSelectedColor("")
              }}
              style={{
                position: "relative",
                flexShrink: 0,
                width: "80px",
                height: "80px",
                overflow: "hidden",
                borderRadius: "4px",
                cursor: "pointer",
                border: mainImage === product.image1 && !selectedColor ? "2px solid #22C55E" : "2px solid transparent",
                transition: "border-color 0.3s ease",
              }}
            >
              <Image
                src={product.image1 || "/placeholder.svg"}
                alt={`${product.name} - Vue 1`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          {product.image2 && (
            <div
              onClick={() => {
                setMainImage(product.image2)
                setSelectedColor("")
              }}
              style={{
                position: "relative",
                flexShrink: 0,
                width: "80px",
                height: "80px",
                overflow: "hidden",
                borderRadius: "4px",
                cursor: "pointer",
                border: mainImage === product.image2 && !selectedColor ? "2px solid #22C55E" : "2px solid transparent",
                transition: "border-color 0.3s ease",
              }}
            >
              <Image
                src={product.image2 || "/placeholder.svg"}
                alt={`${product.name} - Vue 2`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          {product.image3 && (
            <div
              onClick={() => {
                setMainImage(product.image3)
                setSelectedColor("")
              }}
              style={{
                position: "relative",
                flexShrink: 0,
                width: "80px",
                height: "80px",
                overflow: "hidden",
                borderRadius: "4px",
                cursor: "pointer",
                border: mainImage === product.image3 && !selectedColor ? "2px solid #22C55E" : "2px solid transparent",
                transition: "border-color 0.3s ease",
              }}
            >
              <Image
                src={product.image3 || "/placeholder.svg"}
                alt={`${product.name} - Vue 3`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          {product.image4 && (
            <div
              onClick={() => {
                setMainImage(product.image4)
                setSelectedColor("")
              }}
              style={{
                position: "relative",
                flexShrink: 0,
                width: "80px",
                height: "80px",
                overflow: "hidden",
                borderRadius: "4px",
                cursor: "pointer",
                border: mainImage === product.image4 && !selectedColor ? "2px solid #22C55E" : "2px solid transparent",
                transition: "border-color 0.3s ease",
              }}
            >
              <Image
                src={product.image4 || "/placeholder.svg"}
                alt={`${product.name} - Vue 4`}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          )}
          {/* Display color-specific images */}
          {availableColors.map(color => {
            const variantWithImage = variants.find(v => v.color === color && v.image_url)
            if (variantWithImage?.image_url) {
              return (
                <div
                  key={`color-${color}`}
                  onClick={() => {
                    setMainImage(variantWithImage.image_url)
                    setSelectedColor(color)
                  }}
                  style={{
                    position: "relative",
                    flexShrink: 0,
                    width: "80px",
                    height: "80px",
                    overflow: "hidden",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: mainImage === variantWithImage.image_url && selectedColor === color ? "2px solid #22C55E" : "2px solid transparent",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <Image
                    src={variantWithImage.image_url || "/placeholder.svg"}
                    alt={`${product.name} - ${color}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>

      {/* Product Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: "800",
            color: "#1f2937",
            margin: 0,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {product.name}
        </h1>
        
        {/* Price with promotion handling */}
        <div>
          {product.is_on_promotion && product.promotion_price ? (
            <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
              <p style={{ 
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)", 
                fontWeight: "700", 
                color: "#ff4444",
                margin: 0
              }}>
                {product.promotion_price.toFixed(2)} DHS
              </p>
              <p style={{ 
                fontSize: "clamp(1.2rem, 2.5vw, 2rem)", 
                textDecoration: "line-through", 
                color: "#6b7280",
                margin: 0
              }}>
                {product.price.toFixed(2)} DHS
              </p>
              <span style={{ 
                backgroundColor: "#ff4444", 
                color: "white", 
                fontSize: "14px", 
                padding: "6px 12px", 
                borderRadius: "6px",
                fontWeight: "600",
                textTransform: "uppercase"
              }}>
                Promotion
              </span>
            </div>
          ) : (
            <p style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              fontWeight: "700",
              color: "#2A555A",
              margin: 0,
            }}>
              {product.price.toFixed(2)} DHS
            </p>
          )}
        </div>

        {/* Promotion Indicator */}
        {promotionDetails && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#dcfce7",
              color: "#16a34a",
              padding: "10px 15px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "15px",
              border: "1px solid #16a34a",
            }}
          >
            <Tag size={20} />
            <span>{promotionDetails}</span>
          </div>
        )}

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                style={{
                  width: "20px",
                  height: "20px",
                  color: i < Math.floor(product.rating || 0) ? "#2A555A" : "#2A555A",
                  fill: i < Math.floor(product.rating || 0) ? "#2A555A" : "none",
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            {product.rating?.toFixed(1)} ({product.reviews} avis)
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <div style={{ fontSize: "16px", color: "#4b5563", lineHeight: "1.6" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "10px", color: "#1f2937" }}>
              Description du produit
            </h3>
            <p>{product.description}</p>
          </div>
        )}

        {/* Color Selection - Show hex color squares */}
        {!variantsLoading && availableColors.length > 0 && (
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#1f2937" }}>
              Choisir la couleur
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {availableColors.map((color) => {
                const isSelected = selectedColor === color
                const hasStock = variants.some(v => v.color === color && v.stock_quantity > 0)
                const colorHex = getColorHex(color)
                
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    disabled={!hasStock}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      border: isSelected ? "2px solid #2A555A" : "2px solid #d1d5db",
                      backgroundColor: isSelected ? "#F0FDF4" : "white",
                      borderRadius: "6px",
                      cursor: hasStock ? "pointer" : "not-allowed",
                      fontSize: "14px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                      opacity: hasStock ? 1 : 0.5,
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "3px",
                        backgroundColor: colorHex,
                        border: colorHex === "#FFFFFF" ? "1px solid #ddd" : "1px solid transparent",
                      }}
                    />
                    <span style={{ color: isSelected ? "#2A555A" : hasStock ? "#1f2937" : "#9ca3af" }}>
                      {color}
                    </span>
                    {!hasStock && (
                      <span style={{ fontSize: "10px", color: "#ef4444" }}>Rupture</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {!variantsLoading && availableSizesForColor.length > 0 && (
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#1f2937" }}>
              Choisir la taille
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {availableSizesForColor.map((variant) => (
                <button
                  key={`${variant.color || 'no-color'}-${variant.size}`}
                  onClick={() => setSelectedSize(variant.size)}
                  disabled={variant.stock_quantity === 0}
                  style={{
                    padding: "12px 16px",
                    border: selectedSize === variant.size ? "2px solid #2A555A" : "2px solid #d1d5db",
                    backgroundColor: selectedSize === variant.size ? "#F0FDF4" : "white",
                    color:
                      selectedSize === variant.size ? "#2A555A" : variant.stock_quantity === 0 ? "#9ca3af" : "#1f2937",
                    borderRadius: "6px",
                    cursor: variant.stock_quantity === 0 ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    transition: "all 0.3s ease",
                    opacity: variant.stock_quantity === 0 ? 0.5 : 1,
                  }}
                >
                  {variant.size}
                  {variant.stock_quantity === 0 && (
                    <span style={{ display: "block", fontSize: "10px", fontWeight: "400" }}>Rupture</span>
                  )}
                </button>
              ))}
            </div>
            {selectedSize && selectedVariant && (
              <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "10px" }}>
                Stock disponible: {selectedVariant.stock_quantity} pièce{selectedVariant.stock_quantity > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <span
            style={{
              backgroundColor: isInStock ? "#2A555A" : "#ef4444",
              color: "white",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {isInStock ? "En stock" : "En rupture de stock"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
          <Button
            onClick={() => {
              if (availableColors.length > 0 && !selectedColor) {
                alert("Veuillez sélectionner une couleur")
                return
              }
              if (availableSizesForColor.length > 0 && !selectedSize) {
                alert("Veuillez sélectionner une taille")
                return
              }
              addToCart(product, selectedSize, selectedColor)
            }}
            disabled={!isInStock}
            style={{
              width: "100%",
              backgroundColor: "#2A555A",
              color: "white",
              border: "none",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "700",
              borderRadius: "0px",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
              opacity: isInStock ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (isInStock) {
                e.currentTarget.style.backgroundColor = "#1f2937"
              }
            }}
            onMouseLeave={(e) => {
              if (isInStock) {
                e.currentTarget.style.backgroundColor = "#2A555A"
              }
            }}
          >
            <ShoppingCart size={20} style={{ marginRight: "8px" }} /> Ajouter au panier
          </Button>
          <Button
            onClick={handleBuyViaWhatsAppClick}
            disabled={!isInStock}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              color: "#1f2937",
              border: "1px solid #1f2937",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "700",
              borderRadius: "0px",
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              opacity: isInStock ? 1 : 0.6,
            }}
            onMouseEnter={(e) => {
              if (isInStock) {
                e.currentTarget.style.backgroundColor = "#1f2937"
                e.currentTarget.style.color = "white"
              }
            }}
            onMouseLeave={(e) => {
              if (isInStock) {
                e.currentTarget.style.backgroundColor = "transparent"
                e.currentTarget.style.color = "#1f2937"
              }
            }}
          >
            <Whatsapp size={20} /> Acheter via WhatsApp
          </Button>
        </div>

        {/* Features */}
        <div
          style={{
            borderTop: "1px solid #e5e7eb",
            paddingTop: "24px",
            marginTop: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#4b5563" }}>
            <Truck style={{ width: "20px", height: "20px" }} />
            <span>Livraison gratuite par tout le Maroc</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#4b5563" }}>
            <Shield style={{ width: "20px", height: "20px" }} />
            <span>Garantie qualité</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#4b5563" }}>
            <RotateCcw style={{ width: "20px", height: "20px" }} />
            <span>Retour gratuit sous 30 jours</span>
          </div>
        </div>
      </div>
    </div>
  )
}
