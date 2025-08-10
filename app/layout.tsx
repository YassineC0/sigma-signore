import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { CustomCursor } from "@/components/custom-cursor"
import { ModernHeader } from "@/components/modern-header"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ModernFooter } from "@/components/modern-footer"
import { CartProvider } from "@/contexts/CartContext" // Import CartProvider
import Script from "next/script" // Import the Script component

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "✨ Confort et style, 👔 L'élégance avant tout, 💼 Vêtements pour hommes raffinés! 📦LIVRAISON GRATUITE PARTOUT AU MAROC 🇲🇦", // Change this line
  description: "Marque de streetwear premium - Vêtements de qualité et mode urbaine",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        
      </head>
      <body className={`${inter.className} bg-white text-gray-900`} style={{ margin: 0, padding: 0 }}>
        

        <CartProvider>
          <ModernHeader />
          {children}
          <ModernFooter />
          <CustomCursor />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}
