"use client"

import { ShoppingCart } from "lucide-react"
import { useState } from "react"

export function CartIcon() {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300) // Reset after animation
  }

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200 ${
        isClicked ? "animate-click" : ""
      }`}
    >
      <ShoppingCart className="w-6 h-6 text-gray-100" />
    </button>
  )
}
