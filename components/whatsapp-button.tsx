"use client"

import { PhoneIcon as Whatsapp } from "lucide-react"
import { useEffect, useState } from "react"

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const whatsappLink = "https://wa.me/212643830086?text=Bonjour,%20je%20suis%20intéressé(e)%20par%20vos%20produits." // Replace with your actual WhatsApp number

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chattez avec nous sur WhatsApp"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#25D366", // Original WhatsApp green
        color: "#ffffff", // Changed icon color to white for contrast
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        zIndex: 100,
        transition: "transform 0.3s ease, opacity 0.3s ease",
        transform: isVisible ? "scale(1)" : "scale(0)",
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? "heartbeat 1.5s infinite" : "none", // Heartbeat animation
      }}
    >
      <Whatsapp size={30} />
      <style jsx>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          14% {
            transform: scale(1.1);
          }
          28% {
            transform: scale(1);
          }
          42% {
            transform: scale(1.1);
          }
          70% {
            transform: scale(1);
          }
        }
      `}</style>
    </a>
  )
}
