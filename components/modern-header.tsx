"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // Import Image component
import { ShoppingCart, User, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartModal } from "@/components/cart-modal"
import { useCart } from "@/contexts/CartContext"
import { usePathname } from "next/navigation"
import { useCategories } from "@/hooks/useCategories"

export function ModernHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { items, isOpen, setIsOpen } = useCart()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll)
    // Initial check for scroll position on mount
    handleScroll()
    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
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

  // Dynamic header styles based on scroll and homepage status
  const headerBg = isHomePage && !isScrolled ? "transparent" : "white"
  const headerBorder = isHomePage && !isScrolled ? "1px solid transparent" : "1px solid hsl(0 0% 89.8%)"
  const headerShadow = isHomePage && !isScrolled ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)"

  // Text and icon colors will be white when transparent, black when white
  const textColor = isHomePage && !isScrolled ? "white" : "hsl(0 0% 9%)"
  const hoverTextColor = isHomePage && !isScrolled ? "rgba(255,255,255,0.8)" : "hsl(0 0% 40%)"

  const linkStyle = (isHovered: boolean) => ({
    fontSize: "14px",
    fontWeight: "500",
    color: textColor,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    textDecoration: "none",
    transition: "color 0.3s ease",
    whiteSpace: "nowrap",
    ...(isHovered && { color: hoverTextColor }),
  })

  const buttonStyle = (isHovered: boolean) => ({
    backgroundColor: isHomePage && !isScrolled ? "white" : "transparent",
    color: isHomePage && !isScrolled ? "black" : "hsl(0 0% 9%)",
    border: isHomePage && !isScrolled ? "1px solid white" : "1px solid hsl(0 0% 9%)",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: "500",
    borderRadius: "0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    ...(isHovered && {
      backgroundColor: "hsl(0 0% 9%)",
      color: "white",
    }),
  })

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: headerBg,
          backdropFilter: isScrolled ? "blur(8px)" : "none",
          borderBottom: headerBorder,
          boxShadow: headerShadow,
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "70px",
              position: "relative", // Needed for absolute positioning of logo on mobile
            }}
          >
            {isMobile ? (
              <>
                {/* Mobile Menu Button (Left) */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: textColor, // Dynamic color
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2, // Ensure it's above logo if overlapping
                  }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                {/* Logo (Centered) */}
                <Link
                  href="/"
                  style={{
                    position: "absolute", // Absolute positioning for centering
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    zIndex: 1, // Logo can be behind buttons if they are zIndex 2
                  }}
                >
                  <Image
                    src="/bgless_logo.png" // Use Image component for logo
                    alt="L3AOUNI STYLE Logo"
                    width={100} // Bigger on mobile
                    height={100}
                    style={{ filter: "none" }} // Logo always black
                  />
                </Link>
                {/* Cart Button (Right) */}
                <button
                  onClick={() => setIsOpen(true)}
                  style={{
                    position: "relative",
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: textColor, // Dynamic color
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2, // Ensure it's above logo if overlapping
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = hoverTextColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
                >
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        backgroundColor: "hsl(0 0% 9%)",
                        color: "hsl(0 0% 98%)",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${headerBg}`, // Border matches header background
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* Desktop Layout */}
                <Link
                  href="/"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                    transition: "opacity 0.3s ease",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  <Image
                    src="/bgless_logo.png" // Use Image component for logo
                    alt="L3AOUNI STYLE Logo"
                    width={110} // Standard size for desktop
                    height={100}
                    style={{ filter: "none" }}
                  />
                </Link>
                <nav
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "32px",
                  }}
                >
                  <Link
                    href="/products"
                    style={linkStyle(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = hoverTextColor)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
                  >
                    Toutes catégories
                  </Link>
                  {!categoriesLoading &&
                    categoriesError === null &&
                    categories.length > 0 &&
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products/${createSlug(category.name)}`}
                        style={linkStyle(false)}
                        onMouseEnter={(e) => (e.currentTarget.style.color = hoverTextColor)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
                      >
                        {category.name.trim()}
                      </Link>
                    ))}
                  <Link href="/admin/login" style={{ textDecoration: "none" }}>
                    <Button
                      style={buttonStyle(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "hsl(0 0% 9%)"
                        e.currentTarget.style.color = "white"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isHomePage && !isScrolled ? "white" : "transparent"
                        e.currentTarget.style.color = isHomePage && !isScrolled ? "black" : "hsl(0 0% 9%)"
                      }}
                    >
                      <User size={14} />
                      Connexion
                    </Button>
                  </Link>
                </nav>
                <button
                  onClick={() => setIsOpen(true)}
                  style={{
                    position: "relative",
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    color: textColor, // Dynamic color
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = hoverTextColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textColor)}
                >
                  <ShoppingCart size={24} />
                  {totalItems > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        backgroundColor: "hsl(0 0% 9%)",
                        color: "hsl(0 0% 98%)",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `2px solid ${headerBg}`, // Border matches header background
                      }}
                    >
                      {totalItems}
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
          {/* Mobile Menu */}
          {isMobile && isMobileMenuOpen && (
            <div
              style={{
                borderTop: "1px solid hsl(0 0% 89.8%)",
                backgroundColor: "white",
                paddingBottom: "16px",
              }}
            >
              <nav
                style={{
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: "16px",
                }}
              >
                <Link
                  href="/products"
                  style={{
                    display: "block",
                    padding: "12px 16px",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "hsl(0 0% 9%)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                    borderBottom: "1px solid hsl(0 0% 96.1%)",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onTouchStart={(e) => {
                    e.currentTarget.style.color = "hsl(0 0% 40%)"
                    e.currentTarget.style.backgroundColor = "hsl(0 0% 96.1%)"
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.color = "hsl(0 0% 9%)"
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  Toutes catégories
                </Link>
                {!categoriesLoading &&
                  categoriesError === null &&
                  categories.length > 0 &&
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products/${createSlug(category.name)}`}
                      style={{
                        display: "block",
                        padding: "12px 16px",
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "hsl(0 0% 9%)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        textDecoration: "none",
                        transition: "all 0.3s ease",
                        borderBottom: "1px solid hsl(0 0% 96.1%)",
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      onTouchStart={(e) => {
                        e.currentTarget.style.color = "hsl(0 0% 40%)"
                        e.currentTarget.style.backgroundColor = "hsl(0 0% 96.1%)"
                      }}
                      onTouchEnd={(e) => {
                        e.currentTarget.style.color = "hsl(0 0% 9%)"
                        e.currentTarget.style.backgroundColor = "transparent"
                      }}
                    >
                      {category.name.trim()}
                    </Link>
                  ))}
                <Link
                  href="/admin/login"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "hsl(0 0% 9%)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  onTouchStart={(e) => {
                    e.currentTarget.style.color = "hsl(0 0% 40%)"
                    e.currentTarget.style.backgroundColor = "hsl(0 0% 96.1%)"
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.color = "hsl(0 0% 9%)"
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <User size={16} />
                  Connexion
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
      <CartModal />
    </>
  )
}
