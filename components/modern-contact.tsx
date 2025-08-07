"use client"
import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react"

export function ModernContact() {
  return (
    <section
      id="contact-section"
      style={{
        width: "100%",
        padding: "clamp(40px, 8vw, 80px) 0",
        backgroundColor: "#ffffff",
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
          Visitez notre <span style={{ color: "#2A555A" }}>magasin</span>
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "clamp(30px, 6vw, 60px)",
            alignItems: "start",
          }}
          className="lg:grid-cols-2"
        >
          {/* Contact Information */}
          <div>
            <h3
              style={{
                fontSize: "clamp(20px, 4vw, 24px)",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "30px",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              Contactez-nous
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Address */}
              
              {/* Phone */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#2A555A", // Changed to green
                    borderRadius: "50%",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "48px",
                    height: "48px",
                  }}
                >
                  <Phone size={20} color="#ffffff" /> {/* Icon color changed to white for contrast */}
                </div>
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>
                    Téléphone
                  </h4>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>+212 657-941162</p>
                </div>
              </div>
              {/* Hours */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
                <div
                  style={{
                    backgroundColor: "#2A555A", // Changed to green
                    borderRadius: "50%",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "48px",
                    height: "48px",
                  }}
                >
                  <Clock size={20} color="#ffffff" /> {/* Icon color changed to white for contrast */}
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
                  href="https://www.instagram.com/luxury_.clothess/" // Updated Instagram link
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)", // Original Instagram gradient
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
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <Instagram size={20} color="#ffffff" />
                </a>
                <a
                  href="https://www.facebook.com/share/1CW4UDwWN6/?mibextid=wwXIfr" // Updated Facebook link
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: "#3b5998", // Original Facebook blue
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
                    e.currentTarget.style.backgroundColor = "#2d4373"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#3b5998"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  <Facebook size={20} color="#ffffff" />
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
