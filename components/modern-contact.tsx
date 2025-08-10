"use client"
import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react"

export function ModernContact() {
  return (
    <section
      id="contact-section"
      style={{
        width: "100%",
        padding: "clamp(40px, 8vw, 80px) 0",
        backgroundColor: "#ffffff", // Changed back to white
        color: "#1f2937", // Dark text color for contrast
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
            color: "#1f2937", // Dark text color
            marginBottom: "clamp(40px, 8vw, 60px)",
            fontFamily: "'Playfair Display', serif", // Elegant font for the title
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
          }}
        >
          Visitez notre <span style={{ color: "#4a4a4a" }}>magasin</span> {/* Slightly lighter dark for highlight */}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(30px, 6vw, 60px)",
            alignItems: "start",
          }}
          className="lg:grid-cols-2" // Responsive grid for larger screens
        >
          {/* Contact Information */}
          <div>
            <h3
              style={{
                fontSize: "clamp(20px, 4vw, 24px)",
                fontWeight: "700",
                color: "#1f2937", // Dark text color
                marginBottom: "30px",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              Contactez-nous
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Address */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#f0f0f0", // Light background for icon container
                    border: "1px solid #d1d5db", // Subtle border
                    borderRadius: "50%",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "48px",
                    height: "48px",
                  }}
                >
                  <MapPin size={20} color="#1f2937" /> {/* Icon color changed to dark */}
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>
                    Adresse
                  </h4>
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                    123 Rue Mohammed V<br />
                    Meknes, Maroc
                  </p>
                </div>
              </div>
              {/* Phone */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#f0f0f0", // Light background for icon container
                    border: "1px solid #d1d5db", // Subtle border
                    borderRadius: "50%",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "48px",
                    height: "48px",
                  }}
                >
                  <Phone size={20} color="#1f2937" /> {/* Icon color changed to dark */}
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>
                    Téléphone
                  </h4>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>+212 631-366613</p> {/* Updated phone number */}
                </div>
              </div>
              {/* Hours */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#f0f0f0", // Light background for icon container
                    border: "1px solid #d1d5db", // Subtle border
                    borderRadius: "50%",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "48px",
                    height: "48px",
                  }}
                >
                  <Clock size={20} color="#1f2937" /> {/* Icon color changed to dark */}
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>
                    Horaires
                  </h4>
                  <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5" }}>
                    Lun - Sam: 9h00 - 20h00
                    <br />
                    Dimanche: 10h00 - 18h00
                  </p>
                </div>
              </div>
            </div>
            {/* Social Media */}
            <div style={{ marginTop: "40px" }}>
              <h4 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
                Suivez-nous
              </h4>
              <div style={{ display: "flex", gap: "15px" }}>
                <a
                  href="https://www.instagram.com/classiquesignore/" // Updated Instagram link
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#f0f0f0", // Light background
                    border: "1px solid #d1d5db", // Subtle border
                    borderRadius: "50%",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e5e7eb" // Slightly darker light on hover
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <Instagram size={20} color="#1f2937" />
                </a>
                <a
                  href="https://www.facebook.com/classiquesignore/" // Updated Facebook link
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#f0f0f0", // Light background
                    border: "1px solid #d1d5db", // Subtle border
                    borderRadius: "50%",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    transition: "all 0.3s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e5e7eb" // Slightly darker light on hover
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f0f0"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <Facebook size={20} color="#1f2937" />
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
