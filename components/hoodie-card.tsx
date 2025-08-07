"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"
import type { Product } from "@/types/product"

interface HoodieCardProps {
  product: Product
}

export function HoodieCard({ product }: HoodieCardProps) {
  const { addToCart } = useCart()

  // Use mainImage from API (first color variant image or image1)
  const displayImage = product.mainImage || product.image1 || "/placeholder.svg?height=300&width=300"

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <Link href={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative w-full aspect-square overflow-hidden">
          <Image
            src={displayImage || "/placeholder.svg"}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight group-hover:text-yellow-600 transition-colors duration-300">
            {product.name}
          </h3>
          {/* Price with promotion handling */}
          <div className="mb-4">
            {product.is_on_promotion && product.promotion_price ? (
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-red-500">{product.promotion_price.toFixed(2)} DHS</p>
                <p className="text-sm text-gray-500 line-through">{product.price.toFixed(2)} DHS</p>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">PROMO</span>
              </div>
            ) : (
              <p className="text-xl font-bold text-yellow-500">{product.price.toFixed(2)} DHS</p>
            )}
          </div>
        </div>
      </Link>
      {/* Action Button */}
      <div className="p-4 pt-0">
        <Button
          onClick={(e) => {
            e.preventDefault() // Prevent navigation when clicking the button
            addToCart(product)
          }}
          className="w-full bg-yellow-500 text-gray-900 border-none py-3 text-base font-semibold rounded-none uppercase tracking-wide transition-all duration-300 hover:bg-yellow-400 hover:scale-[1.02]"
        >
          Ajouter au panier
        </Button>
      </div>
    </div>
  )
}
