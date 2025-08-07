"use client"

import { useState, useEffect } from "react"

interface ProductVariant {
  id: number
  product_id: number
  size: string
  stock_quantity: number
  created_at: string
  updated_at: string
}

export function useProductVariants(productId: number | string) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products/${productId}/variants`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setVariants(data)
      } catch (err) {
        console.error("Error fetching variants:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch variants")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchVariants()
    }
  }, [productId])

  return { variants, loading, error }
}
