"use client"
import { useState, useEffect } from "react"
import { useProducts } from "@/hooks/useProducts"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product-card" // Import ProductCard
import type { Product } from "@/types/product"

interface CategoryProductsPageProps {
  category?: string
  title: string
}

export function CategoryProductsPage({ category, title }: CategoryProductsPageProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { products, pagination, loading, error } = useProducts({
    category,
    page: currentPage,
    limit: 20,
  })

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
              borderTop: "4px solid #2A555A",
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
            fontFamily: "'Playfair Display', serif", // Changed font for consistency
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          {title} <span style={{ color: "#4a4a4a" }}>COLLECTION</span>
        </h1>

        {/* Products Count */}
        {safePagination && (
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "16px", color: "#6b7280" }}>
              
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
                gridTemplateColumns: isMobile ? "repeat(1, 1fr)" : "repeat(auto-fill, minmax(280px, 1fr))", // Changed to 1 column for mobile
                gap: "30px",
                marginBottom: "60px",
              }}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product as Product}
                  index={index}
                  isVisible={true} // All products are visible in the grid
                  isMobile={isMobile}
                  showAddToCartButton={false} // Hide "Ajouter au panier" button on this page
                />
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
                    border: "2px solid #2A555A",
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
