"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/types/product"

interface CartItem extends Product {
  quantity: number
  selectedSize?: string
  selectedColor?: string
  cartItemId: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, size?: string, color?: string) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  subtotal: number
  promotionalSubtotal: number
  promotionalSavings: number
  appliedPromotions: string[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Helper function to determine if a product is a polo
const isPolo = (product: Product): boolean => {
  const name = product.name.toLowerCase()
  const category = product.category?.toLowerCase() || ""
  return name.includes("polo") || category.includes("polo")
}

// Helper function to determine if a product is a t-shirt
const isTShirt = (product: Product): boolean => {
  const name = product.name.toLowerCase()
  const category = product.category?.toLowerCase() || ""
  return (
    (name.includes("t-shirt") ||
      name.includes("tshirt") ||
      category.includes("t-shirt") ||
      category.includes("shirt")) &&
    !isPolo(product)
  )
}

// Helper function to determine if a product is eligible for general pants category (not 259 DH items)
const isGeneralPants = (product: Product): boolean => {
  const name = product.name.toLowerCase()
  const category = product.category?.toLowerCase() || ""
  return (
    (name.includes("pantalon") ||
      name.includes("pants") ||
      name.includes("jean") ||
      name.includes("short") ||
      category.includes("pantalon") ||
      category.includes("pants") ||
      category.includes("short")) &&
    product.price !== 259
  )
}

// Calculate promotional pricing
const calculatePromotionalPricing = (items: CartItem[]) => {
  let regularTotal = 0
  let promotionalTotal = 0
  let savings = 0
  const appliedPromotions: string[] = []

  const mutableIndividualItems: (CartItem & { processed: boolean; originalPrice: number })[] = items.flatMap((item) =>
    Array(item.quantity).fill({ ...item, quantity: 1, processed: false, originalPrice: item.price }),
  )

  regularTotal = mutableIndividualItems.reduce((sum, item) => sum + item.originalPrice, 0)
  promotionalTotal = regularTotal

  // Apply Polo Bundle
  const eligiblePoloItems = mutableIndividualItems.filter((item) => isPolo(item) && !item.processed)
  let poloCount = eligiblePoloItems.length

  if (poloCount >= 2) {
    eligiblePoloItems.sort((a, b) => a.originalPrice - b.originalPrice)

    while (poloCount >= 2) {
      if (poloCount >= 3) {
        const itemsForBundle = eligiblePoloItems.splice(0, 3)
        const currentRegularPrice = itemsForBundle.reduce((sum, item) => sum + item.originalPrice, 0)
        const discount = currentRegularPrice - 400
        promotionalTotal -= discount
        savings += discount
        appliedPromotions.push("3 Polos pour 400 DHS")
        itemsForBundle.forEach((item) => {
          const originalItemIndex = mutableIndividualItems.findIndex((mi) => mi === item)
          if (originalItemIndex !== -1) mutableIndividualItems[originalItemIndex].processed = true
        })
        poloCount -= 3
      } else if (poloCount >= 2) {
        const itemsForBundle = eligiblePoloItems.splice(0, 2)
        const currentRegularPrice = itemsForBundle.reduce((sum, item) => sum + item.originalPrice, 0)
        const discount = currentRegularPrice - 300
        promotionalTotal -= discount
        savings += discount
        appliedPromotions.push("2 Polos pour 300 DHS")
        itemsForBundle.forEach((item) => {
          const originalItemIndex = mutableIndividualItems.findIndex((mi) => mi === item)
          if (originalItemIndex !== -1) mutableIndividualItems[originalItemIndex].processed = true
        })
        poloCount -= 2
      } else {
        break
      }
    }
  }

  // Apply T-Shirt Bundle
  const eligibleTShirtItems = mutableIndividualItems.filter((item) => isTShirt(item) && !item.processed)
  let tshirtCount = eligibleTShirtItems.length

  if (tshirtCount >= 2) {
    eligibleTShirtItems.sort((a, b) => a.originalPrice - b.originalPrice)

    while (tshirtCount >= 2) {
      if (tshirtCount >= 3) {
        const itemsForBundle = eligibleTShirtItems.splice(0, 3)
        const currentRegularPrice = itemsForBundle.reduce((sum, item) => sum + item.originalPrice, 0)
        const discount = currentRegularPrice - 400
        promotionalTotal -= discount
        savings += discount
        appliedPromotions.push("3 T-shirts pour 400 DHS")
        itemsForBundle.forEach((item) => {
          const originalItemIndex = mutableIndividualItems.findIndex((mi) => mi === item)
          if (originalItemIndex !== -1) mutableIndividualItems[originalItemIndex].processed = true
        })
        tshirtCount -= 3
      } else if (tshirtCount >= 2) {
        const itemsForBundle = eligibleTShirtItems.splice(0, 2)
        const currentRegularPrice = itemsForBundle.reduce((sum, item) => sum + item.originalPrice, 0)
        const discount = currentRegularPrice - 300
        promotionalTotal -= discount
        savings += discount
        appliedPromotions.push("2 T-shirts pour 300 DHS")
        itemsForBundle.forEach((item) => {
          const originalItemIndex = mutableIndividualItems.findIndex((mi) => mi === item)
          if (originalItemIndex !== -1) mutableIndividualItems[originalItemIndex].processed = true
        })
        tshirtCount -= 2
      } else {
        break
      }
    }
  }

  // Apply 259 DH Item Bundle
  const eligibleItems259 = mutableIndividualItems.filter((item) => item.originalPrice === 259 && !item.processed)
  let count259 = eligibleItems259.length

  while (count259 >= 2) {
    const itemsForBundle = eligibleItems259.splice(0, 2)
    const currentRegularPrice = itemsForBundle.reduce((sum, item) => sum + item.originalPrice, 0)
    const discount = currentRegularPrice - 480
    promotionalTotal -= discount
    savings += discount
    appliedPromotions.push(`2 articles à 259 DHS pour 480 DHS`)
    itemsForBundle.forEach((item) => {
      const originalItemIndex = mutableIndividualItems.findIndex((mi) => mi === item)
      if (originalItemIndex !== -1) mutableIndividualItems[originalItemIndex].processed = true
    })
    count259 -= 2
  }

  // Apply General Pants Bundle
  const eligibleGeneralPants = mutableIndividualItems.filter((item) => isGeneralPants(item) && !item.processed)
  let generalPantsCount = eligibleGeneralPants.length

  while (generalPantsCount >= 2) {
    const itemsForBundle = eligibleGeneralPants.splice(0, 2)
    const currentRegularPrice = itemsForBundle.reduce((sum, item) => sum + item.originalPrice, 0)
    const discount = currentRegularPrice - 450
    promotionalTotal -= discount
    savings += discount
    appliedPromotions.push("2 Pantalons pour 450 DHS")
    itemsForBundle.forEach((item) => {
      const originalItemIndex = mutableIndividualItems.findIndex((mi) => mi === item)
      if (originalItemIndex !== -1) mutableIndividualItems[originalItemIndex].processed = true
    })
    generalPantsCount -= 2
  }

  // Separate Products Discount
  const unbundledUniqueProductTypes = new Set<string>()
  mutableIndividualItems
    .filter((item) => !item.processed)
    .forEach((item) => {
      unbundledUniqueProductTypes.add(`${item.id}-${item.selectedSize || "no-size"}-${item.selectedColor || "no-color"}`)
    })

  if (unbundledUniqueProductTypes.size >= 2) {
    const separateProductDiscountAmount = (unbundledUniqueProductTypes.size - 1) * 30
    promotionalTotal -= separateProductDiscountAmount
    savings += separateProductDiscountAmount
    appliedPromotions.push(`Réduction produits séparés: -${separateProductDiscountAmount} DHS`)
  }

  return {
    regularTotal,
    promotionalTotal,
    savings,
    appliedPromotions,
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, size?: string, color?: string) => {
    setItems((prevItems) => {
      const cartItemId = `${product.id}-${size || "no-size"}-${color || "no-color"}`

      const existingItem = prevItems.find((item) => item.cartItemId === cartItemId)

      if (existingItem) {
        return prevItems.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      const newItem: CartItem = {
        ...product,
        quantity: 1,
        selectedSize: size,
        selectedColor: color,
        cartItemId,
      }

      return [...prevItems, newItem]
    })

    setIsOpen(true)
  }

  const removeFromCart = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const pricingData = calculatePromotionalPricing(items)
  const subtotal = pricingData.regularTotal
  const promotionalSubtotal = pricingData.promotionalTotal
  const promotionalSavings = pricingData.savings
  const appliedPromotions = pricingData.appliedPromotions

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        subtotal,
        promotionalSubtotal,
        promotionalSavings,
        appliedPromotions,
        isOpen,
        setIsOpen,
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
