"use client"

import { Facebook, Instagram, Mail, MapPin, Phone, PhoneIcon as Whatsapp } from "lucide-react"
import Link from "next/link"

export function ModernFooter() {
  return (
    <footer
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "60px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
        }}
      >
        {/* Brand Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            CLASSIQUE <span style={{ color: "hsl(0, 0%, 90%)" }}>SIGNORE</span>
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#a0aec0" }}>
            Nous offrons des vêtements de qualité et des designs urbains
            qui se démarquent.
          </p>
          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            <a
              href="https://www.instagram.com/classiquesignore/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram
                size={24}
                color="#ffffff"
                style={{ transition: "color 0.3s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(45 100% 51%)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
              />
            </a>
            <a href="https://wa.me/212643830086" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <Whatsapp
                size={24}
                color="#ffffff"
                style={{ transition: "color 0.3s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(45 100% 51%)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
              />
            </a>
            <a
              href="https://www.facebook.com/classiquesignore"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook
                size={24}
                color="#ffffff"
                style={{ transition: "color 0.3s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(45 100% 51%)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
              />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#ffffff" }}>Liens Rapides</h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            <li>
              <Link href="/" passHref>
                <p
                  style={{ fontSize: "14px", color: "#a0aec0", textDecoration: "none", transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(45 100% 51%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#a0aec0")}
                >
                  Accueil
                </p>
              </Link>
            </li>
            <li>
              <Link href="/products" passHref>
                <p
                  style={{ fontSize: "14px", color: "#a0aec0", textDecoration: "none", transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(45 100% 51%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#a0aec0")}
                >
                  Boutique
                </p>
              </Link>
            </li>
            <li>
              <Link href="/#categories-section" passHref>
                <p
                  style={{ fontSize: "14px", color: "#a0aec0", textDecoration: "none", transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(45 100% 51%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#a0aec0")}
                >
                  Catégories
                </p>
              </Link>
            </li>
            <li>
              <Link href="/#contact-section" passHref>
                <p
                  style={{ fontSize: "14px", color: "#a0aec0", textDecoration: "none", transition: "color 0.3s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(45 100% 51%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#a0aec0")}
                >
                  Contact
                </p>
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "#ffffff" }}>
            Contactez-nous
          </h3>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
            
            <li style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#a0aec0" }}>
              <Phone size={18} color="#a0aec0" /> +212 643830086
            </li>
            
          </ul>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #4a5568",
          marginTop: "40px",
          paddingTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#a0aec0",
        }}
      >
        &copy; {new Date().getFullYear()} Classique Signore. Tous droits réservés.
      </div>
    </footer>
  )
}
