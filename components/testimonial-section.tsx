"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export function TestimonialSection() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      name: "Fatima Z.",
      location: "Casablanca",
      review:
        "J'adore la qualité des sweats à capuche ! Ils sont super confortables et les designs sont uniques. La livraison a été rapide aussi.",
      avatar: "/a3.jpeg",
    },
    {
      name: "Ahmed B.",
      location: "Rabat",
      review:
        "Enfin une marque de streetwear qui comprend le style marocain. Les t-shirts sont incroyables, je recommande vivement L3aouni Style.",
      avatar: "/a2.jpeg",
    },
    {
      name: "Mohammed J.",
      location: "Marrakech",
      review:
        "Le service client est excellent et les produits sont encore plus beaux en vrai. J'ai acheté une paire de sneakers et je suis très satisfaite.",
      avatar: "/a1.jpeg",
    },
    {
      name: "Youssef H.",
      location: "Fès",
      review:
        "Des designs frais et une qualité irréprochable. C'est ma nouvelle boutique préférée pour le streetwear. Continuez comme ça !",
      avatar: "/ut.png",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
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
  }, [])

  return (
    <section
      id="testimonials-section"
      ref={sectionRef}
      style={{
        width: "100%",
        padding: "80px 0",
        backgroundColor: "#f8f9fa",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px" }}>
        <h2
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
          CE QUE DISENT NOS <span style={{ color: "hsl(186.3, 36.4%, 25.9%)" }}>CLIENTS</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
                padding: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Image
                src={testimonial.avatar || "/placeholder.svg"}
                alt={`Avatar de ${testimonial.name}`}
                width={80}
                height={80}
                style={{ borderRadius: "50%", marginBottom: "20px", objectFit: "cover" }}
              />
              <p style={{ fontSize: "16px", color: "#4b5563", lineHeight: "1.6", marginBottom: "20px" }}>
                &quot;{testimonial.review}&quot;
              </p>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", margin: 0 }}>{testimonial.name}</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: "5px 0 0 0" }}>{testimonial.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
