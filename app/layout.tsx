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
  title: "Importé de Turquie 🇹🇷, ✅Soyez Tendance, Restez Confortable! 📦LIVRAISON GRATUITE PARTOUT AU MAROC 🇲🇦", // Change this line
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
        {/* Facebook Meta Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1455702825232316');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-white text-gray-900`} style={{ margin: 0, padding: 0 }}>
        {/* Facebook Meta Pixel Noscript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1455702825232316&ev=PageView&noscript=1"
            alt="" // Added alt attribute for accessibility
          />
        </noscript>

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
