"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export function CollectionsSection({ categories }: { categories: any[] }) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([false, false, false])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset and animate items one by one every time section comes into view
          setVisibleItems([false, false, false])
          categories.forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const newState = [...prev]
                newState[index] = true
                return newState
              })
            }, index * 200)
          })
        } else {
          // Reset when out of view
          setVisibleItems([false, false, false])
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [categories])

  return (
    <section
      id="collections-section"
      ref={sectionRef}
      style={{
        width: "100%",
        padding: "80px 0",
        backgroundColor: "#f9fafb",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 16px" }}>
        <h2
          style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: "800",
            textAlign: "center",
            color: "#1f2937",
            marginBottom: "64px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Top <span style={{ color: "#fbbf24" }}>Collections</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px",
          }}
        >
          {categories.map((collection, index) => (
            <div
              key={collection.name}
              style={{
                position: "relative",
                height: "400px",
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                opacity: visibleItems[index] ? 1 : 0,
                transform: visibleItems[index] ? "translateY(0) scale(1)" : "translateY(50px) scale(0.9)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                transitionDelay: `${index * 200}ms`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px) scale(1.02)"
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(251, 191, 36, 0.2)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)"
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Image
                src={collection.image || "/placeholder.svg"}
                alt={collection.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
                  padding: "40px 24px 24px",
                }}
              >
                <h3
                  style={{
                    color: "white",
                    fontSize: "28px",
                    fontWeight: "700",
                    marginBottom: "8px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                    transform: visibleItems[index] ? "translateY(0)" : "translateY(20px)",
                    transition: "transform 0.6s ease",
                    transitionDelay: `${index * 200 + 300}ms`,
                  }}
                >
                  {collection.name}
                </h3>
              </div>

              {/* Yellow fade overlay on hover */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(135deg, rgba(251, 191, 36, 0) 0%, rgba(251, 191, 36, 0) 100%)",
                  transition: "all 0.3s ease",
                  pointerEvents: "none",
                }}
                className="yellow-fade-overlay"
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .yellow-fade-overlay:hover {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%) !important;
        }
      `}</style>
    </section>
  )
}
