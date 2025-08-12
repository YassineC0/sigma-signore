"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useDeliveryCities } from "@/hooks/useDeliveryCities"
import { Minus, Plus, Trash2, ShoppingCart, MapPin, Phone, User, Mail } from "lucide-react"
import Image from "next/image"

export default function CheckoutPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()
  const { cities } = useDeliveryCities()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const deliveryFee = 0
  const total = cartTotal + deliveryFee

  const generateWhatsAppMessage = () => {
    let message = "🛍️ *Nouvelle Commande*\n\n"

    message += "👤 *Informations Client:*\n"
    message += `Nom: ${customerInfo.name}\n`
    message += `Téléphone: ${customerInfo.phone}\n`
    
    message += `Ville: ${customerInfo.city}\n`
    message += `Adresse: ${customerInfo.address}\n\n`

    message += "📦 *Produits Commandés:*\n"
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`
      if (item.selectedColor) message += `   Couleur: ${item.selectedColor}\n`
      if (item.selectedSize) message += `   Taille: ${item.selectedSize}\n`
      message += `   Quantité: ${item.quantity}\n`
      message += `   Prix unitaire: ${item.price.toFixed(2)} DHS\n\n`
    })

    message += "💰 *Récapitulatif:*\n"
    message += `Sous-total: ${cartTotal.toFixed(2)} DHS\n`
    message += `Livraison: ${deliveryFee.toFixed(2)} DHS\n`
    message += `*Total: ${total.toFixed(2)} DHS*\n\n`

    message += "📍 Livraison gratuite partout au Maroc!\n"
    message += "🚚 Livraison sous 24-48h"

    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.city || !customerInfo.address) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (cartItems.length === 0) {
      alert("Votre panier est vide")
      return
    }

    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/212643830086?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          paddingTop: "120px",
          textAlign: "center",
        }}
      >
        <ShoppingCart size={64} style={{ color: "#6b7280", marginBottom: "20px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937", marginBottom: "10px" }}>
          Votre panier est vide
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "30px" }}>
          Ajoutez des produits à votre panier pour continuer vos achats
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: "#2A555A",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            textTransform: "uppercase",
          }}
        >
          Continuer mes achats
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        paddingTop: isMobile ? "80px" : "100px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: isMobile ? "0 16px" : "0 20px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "20px" : "30px",
        }}
      >
        {/* Cart Items */}
        <div
          style={{
            flex: isMobile ? "none" : "1",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: isMobile ? "16px" : "24px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? "20px" : "24px",
              fontWeight: "700",
              color: "#1f2937",
              marginBottom: "20px",
            }}
          >
            Votre Panier ({cartItems.length} article{cartItems.length > 1 ? "s" : ""})
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "20px" }}>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "12px" : "15px",
                  padding: isMobile ? "12px" : "15px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  alignItems: isMobile ? "stretch" : "center",
                }}
              >
                {isMobile ? (
                  // Mobile layout
                  <>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div
                        style={{
                          position: "relative",
                          width: "60px",
                          height: "60px",
                          flexShrink: 0,
                          borderRadius: "6px",
                          overflow: "hidden",
                          backgroundColor: "#f3f4f6",
                        }}
                      >
                        <Image
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="60px"
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#1f2937",
                            marginBottom: "4px",
                            lineHeight: "1.3",
                          }}
                        >
                          {item.name}
                        </h3>
                        <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                          {item.selectedColor && <span>Couleur: {item.selectedColor}</span>}
                          {item.selectedColor && item.selectedSize && <span> • </span>}
                          {item.selectedSize && <span>Taille: {item.selectedSize}</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <p style={{ fontSize: "14px", fontWeight: "700", color: "#2A555A", margin: 0 }}>
                            {item.price.toFixed(2)} DHS
                          </p>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Minus size={14} />
                        </button>

                        <span
                          style={{
                            minWidth: "30px",
                            textAlign: "center",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            backgroundColor: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "4px",
                          border: "1px solid #ef4444",
                          backgroundColor: "#fef2f2",
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  // Desktop layout
                  <>
                    <div
                      style={{
                        position: "relative",
                        width: "80px",
                        height: "80px",
                        flexShrink: 0,
                        borderRadius: "6px",
                        overflow: "hidden",
                        backgroundColor: "#f3f4f6",
                      }}
                    >
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="80px"
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                          marginBottom: "5px",
                          lineHeight: "1.3",
                        }}
                      >
                        {item.name}
                      </h3>
                      <div style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                        {item.selectedColor && <span>Couleur: {item.selectedColor}</span>}
                        {item.selectedColor && item.selectedSize && <span> • </span>}
                        {item.selectedSize && <span>Taille: {item.selectedSize}</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <p style={{ fontSize: "16px", fontWeight: "700", color: "#2A555A", margin: 0 }}>
                          {item.price.toFixed(2)} DHS
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "4px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Minus size={16} />
                      </button>

                      <span
                        style={{
                          minWidth: "40px",
                          textAlign: "center",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "4px",
                          border: "1px solid #d1d5db",
                          backgroundColor: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "4px",
                          border: "1px solid #ef4444",
                          backgroundColor: "#fef2f2",
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          marginLeft: "10px",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Customer Info */}
        <div
          style={{
            flex: isMobile ? "none" : "0 0 400px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Customer Information */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: isMobile ? "16px" : "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "20px",
              }}
            >
              Informations de livraison
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  <User size={16} style={{ display: "inline", marginRight: "6px" }} />
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  placeholder="Votre nom complet"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  <Phone size={16} style={{ display: "inline", marginRight: "6px" }} />
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  placeholder="06 XX XX XX XX"
                />
              </div>

              

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  <MapPin size={16} style={{ display: "inline", marginRight: "6px" }} />
                  Ville *
                </label>
                <input
                  type="text"
                  value={customerInfo.city}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "white",
                    boxSizing: "border-box",
                  }}
                  placeholder="Votre ville"
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "6px",
                  }}
                >
                  Adresse complète *
                </label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                  placeholder="Votre adresse complète"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: isMobile ? "16px" : "24px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{
                fontSize: isMobile ? "18px" : "20px",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "20px",
              }}
            >
              Récapitulatif
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
                <span>Sous-total:</span>
                <span>{cartTotal.toFixed(2)} DHS</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px" }}>
                <span>Livraison:</span>
                <span>{deliveryFee.toFixed(2)} DHS</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: isMobile ? "18px" : "20px",
                  fontWeight: "700",
                  color: "#2A555A",
                  paddingTop: "12px",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <span>Total:</span>
                <span>{total.toFixed(2)} DHS</span>
              </div>
            </div>

            <button
              onClick={handleWhatsAppOrder}
              style={{
                width: "100%",
                backgroundColor: "#25D366",
                color: "white",
                border: "none",
                padding: "16px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#128C7E")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#25D366")}
            >
              <Phone size={20} />
              Commander via WhatsApp
            </button>

            <p style={{ fontSize: "12px", color: "#6b7280", textAlign: "center", marginTop: "12px" }}>
              Vous serez redirigé vers WhatsApp pour finaliser votre commande
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
