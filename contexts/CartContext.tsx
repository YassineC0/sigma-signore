"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import type { Product } from "@/types/product"

interface CartItem {
  id: string // Unique ID for the cart item (product ID + variant details)
  productId: number
  name: string
  price: number
  originalPrice: number // Re-added originalPrice for promotional pricing
  imageUrl: string
  quantity: number
  selectedSize?: string | null
  selectedColor?: string | null
  isOnPromotion: boolean // Re-added isOnPromotion for promotional pricing
  // Add other relevant product details if needed for display in cart
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, selectedSize?: string | null, selectedColor?: string | null) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartItemCount: number
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load cart from localStorage on initial mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cartItems")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = useCallback(
    (product: Product, selectedSize: string | null = null, selectedColor: string | null = null) => {
      setCartItems((prevItems) => {
        // Create a unique ID for the cart item based on product ID, color, and size
        const uniqueId = `${product.id}-${selectedColor || "no-color"}-${selectedSize || "no-size"}`

        const existingItemIndex = prevItems.findIndex((item) => item.id === uniqueId)

        if (existingItemIndex > -1) {
          // If item with same product, color, and size exists, update quantity
          const updatedItems = [...prevItems]
          updatedItems[existingItemIndex].quantity += 1
          return updatedItems
        } else {
          const currentPrice =
            product.is_on_promotion && product.promotion_price ? product.promotion_price : product.price

          // Determine the correct image URL with improved logic
          let imageUrl = "/placeholder.svg"

          // Priority 1: If a color is selected, try to find the variant image for that color
          if (selectedColor && product.variants?.length) {
            const colorVariant = product.variants.find((v) => v.color === selectedColor && v.image_url)
            if (colorVariant?.image_url) {
              imageUrl = colorVariant.image_url
            }
          }

          // Priority 2: If no color variant image found, check if product has a mainImage
          if (imageUrl === "/placeholder.svg" && product.mainImage) {
            imageUrl = product.mainImage
          }

          // Priority 3: Fall back to product.image1
          if (imageUrl === "/placeholder.svg" && product.image1) {
            imageUrl = product.image1
          }

          // Add new item to cart
          const newItem: CartItem = {
            id: uniqueId,
            productId: product.id,
            name: product.name,
            price: currentPrice,
            originalPrice: product.price, // Store original price
            imageUrl: imageUrl,
            quantity: 1,
            selectedSize,
            selectedColor,
            isOnPromotion: product.is_on_promotion || false, // Store promotion status
          }
          return [...prevItems, newItem]
        }
      })
      setIsOpen(true)
    },
    [],
  )

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      )
      return updatedItems
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cartItems])

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        setIsOpen,
        isOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
