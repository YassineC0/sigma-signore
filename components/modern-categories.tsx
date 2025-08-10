"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useCategories } from "@/hooks/useCategories"

export function ModernCategories() {
  const [isVisible, setIsVisible] = useState(true) // Changed to true for immediate visibility
  const sectionRef = useRef<HTMLElement>(null)
  const { categories, loading, error } = useCategories()

  useEffect(() => {
    // Intersection Observer for fade-in effect (optional, can be removed if not desired)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Helper function to create URL-friendly slugs
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  if (loading) {
    return (
      <section
        style={{
          padding: "80px 0",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ color: "#6b7280", fontSize: "18px" }}>Chargement des catégories...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        style={{
          padding: "80px 0",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ color: "#ef4444", fontSize: "18px" }}>Erreur lors du chargement des catégories: {error}</div>
      </section>
    )
  }

  console.log("Categories data for ModernCategories:", categories) // Debug log

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        padding: "clamp(40px, 8vw, 80px) 0",
        backgroundColor: "#f8f9fa",
        boxShadow: "inset 0 1px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 20px)",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            fontWeight: "800",
            textAlign: "center",
            color: "#1f2937",
            marginBottom: "clamp(40px, 8vw, 60px)",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          NOS <span style={{ color: "#4a4a4a" }}>CATEGORIES</span>
        </h2>

        {categories.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ color: "#6b7280", fontSize: "18px" }}>Aucune catégorie disponible pour le moment.</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "clamp(20px, 4vw, 30px)",
            }}
          >
            {categories.map((category, index) => {
              const categorySlug = createSlug(category.name)
              console.log(`Category: ${category.name}, Slug: ${categorySlug}, Image: ${category.image}`) // Debug log

              return (
                <Link
                  key={category.id}
                  href={`/products/${categorySlug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transition: "all 0.6s ease",
                    transitionDelay: `${index * 150}ms`,
                    display: "block",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "clamp(300px, 50vw, 400px)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.02)"
                      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    {/* Category Image */}
                    <Image
                      src={category.image || "/placeholder.svg?height=400&width=400&query=category"}
                      alt={category.name}
                      fill
                      style={{
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 3} // Prioritize first 3 images
                    />

                    {/* Overlay for text readability */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)",
                      }}
                    />

                    {/* Text content */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "30px",
                        left: "30px",
                        right: "30px",
                        color: "white",
                        textAlign: "left",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "clamp(1.5rem, 4vw, 2rem)",
                          fontWeight: "800",
                          marginBottom: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                          lineHeight: "1.2",
                        }}
                      >
                        {category.name.trim()}
                      </h3>

                      {category.description && category.description.trim() && (
                        <p
                          style={{
                            fontSize: "clamp(14px, 2.5vw, 16px)",
                            fontWeight: "400",
                            opacity: 0.9,
                            textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                            marginBottom: "12px",
                            lineHeight: "1.4",
                          }}
                        >
                          {category.description.trim()}
                        </p>
                      )}

                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          borderBottom: "2px solid white",
                          display: "inline-block",
                          paddingBottom: "2px",
                          transition: "border-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#2A555A"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "white"
                        }}
                      >
                        SHOP NOW
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
