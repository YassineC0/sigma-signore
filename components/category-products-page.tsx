"use client"
import { useState } from "react"
import { useProducts } from "@/hooks/useProducts"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CategoryProductsPageProps {
  category?: string
  title: string
}

export function CategoryProductsPage({ category, title }: CategoryProductsPageProps) {
  console.log("CategoryProductsPage - category prop:", category)
  console.log("CategoryProductsPage - title prop:", title)
  
  const [currentPage, setCurrentPage] = useState(1)
  const { products, pagination, loading, error } = useProducts({
    category,
    page: currentPage,
    limit: 20,
  })
  const { addToCart } = useCart()

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Ensure pagination is not undefined before accessing its properties
  const safePagination = pagination || { page: 1, limit: 20, total: 0, pages: 0, hasNext: false, hasPrev: false }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "90px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              width: "40px",
              height: "40px",
              border: "4px solid #f3f4f6",
              borderTop: "4px solid #2A555A", // Changed from yellow
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "20px",
            }}
          ></div>
          <p style={{ fontSize: "18px", color: "#6b7280" }}>Chargement des produits...</p>
          <style jsx>{`
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: "90px", backgroundColor: "#ffffff" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "18px", color: "#ef4444" }}>Erreur: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "90px", backgroundColor: "#ffffff" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: "800",
            textAlign: "center",
            color: "#1f2937",
            marginBottom: "60px",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          {title} <span style={{ color: "#2A555A" }}>COLLECTION</span> {/* Changed from yellow */}
        </h1>

        {/* Products Count */}
        {safePagination && (
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>
              {safePagination.total} produit{safePagination.total > 1 ? "s" : ""} trouvé
              {safePagination.total > 1 ? "s" : ""}
              {safePagination.pages > 1 && (
                <span>
                  {" "}
                  - Page {safePagination.page} sur {safePagination.pages}
                </span>
              )}
            </p>
          </div>
        )}

        {products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>Aucun produit trouvé dans cette catégorie.</p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "30px",
                marginBottom: "60px",
              }}
            >
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      transition: "all 0.3s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #f3f4f6",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)"
                      e.currentTarget.style.boxShadow =
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      e.currentTarget.style.borderColor = "#2A555A" // Changed from yellow
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
                      e.currentTarget.style.borderColor = "#f3f4f6"
                    }}
                  >
                    {/* Product Image */}
                    <div style={{ position: "relative", width: "100%", aspectRatio: "1", overflow: "hidden" }}>
                      <img
                        src={product.image1 || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover", 
                          transition: "transform 0.3s ease" 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                        }}
                      />
                    </div>
                    {/* Product Info */}
                    <div style={{ padding: "24px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#1f2937",
                          marginBottom: "12px",
                          lineHeight: "1.4",
                          minHeight: "48px",
                        }}
                      >
                        {product.name}
                      </h3>
                      <p
                        style={{
                          fontSize: "24px",
                          fontWeight: "800",
                          color: "#2A555A", // Changed from yellow
                          marginBottom: "20px",
                          marginTop: "auto",
                        }}
                      >
                        {product.price.toFixed(2)} DHS
                      </p>
                      {/* Action Button */}
                      <Button
                        onClick={(e) => {
                          e.preventDefault()
                          addToCart(product)
                        }}
                        style={{
                          width: "100%",
                          backgroundColor: "#2A555A", // Changed from yellow
                          color: "#ffffff", // Changed text color to white for contrast
                          border: "none",
                          padding: "14px 20px",
                          fontSize: "14px",
                          fontWeight: "700",
                          borderRadius: "8px",
                          cursor: "pointer",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          transition: "all 0.3s ease",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#1f2937" // Darker green on hover
                          e.currentTarget.style.transform = "translateY(-2px)"
                          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#2A555A" // Back to original green
                          e.currentTarget.style.transform = "translateY(0)"
                          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)"
                        }}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {safePagination && safePagination.pages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                  marginTop: "60px",
                  paddingBottom: "40px",
                }}
              >
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!safePagination.hasPrev}
                  style={{
                    backgroundColor: safePagination.hasPrev ? "#1f2937" : "#e5e7eb",
                    color: safePagination.hasPrev ? "white" : "#9ca3af",
                    border: "none",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: safePagination.hasPrev ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                    boxShadow: safePagination.hasPrev ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (safePagination.hasPrev) {
                      e.currentTarget.style.backgroundColor = "#374151"
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (safePagination.hasPrev) {
                      e.currentTarget.style.backgroundColor = "#1f2937"
                      e.currentTarget.style.transform = "translateY(0)"
                    }
                  }}
                >
                  <ChevronLeft size={16} />
                  Précédent
                </Button>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1f2937",
                    border: "2px solid #2A555A", // Changed from yellow
                  }}
                >
                  Page {safePagination.page} sur {safePagination.pages}
                </div>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!safePagination.hasNext}
                  style={{
                    backgroundColor: safePagination.hasNext ? "#1f2937" : "#e5e7eb",
                    color: safePagination.hasNext ? "white" : "#9ca3af",
                    border: "none",
                    padding: "12px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    cursor: safePagination.hasNext ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.3s ease",
                    boxShadow: safePagination.hasNext ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (safePagination.hasNext) {
                      e.currentTarget.style.backgroundColor = "#374151"
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (safePagination.hasNext) {
                      e.currentTarget.style.backgroundColor = "#1f2937"
                      e.currentTarget.style.transform = "translateY(0)"
                    }
                  }}
                >
                  Suivant
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
