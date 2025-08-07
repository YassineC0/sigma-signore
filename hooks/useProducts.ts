"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/types/product"

interface UseProductsOptions {
  category?: string
  featured?: boolean
  page?: number
  limit?: number
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function useProducts(options: UseProductsOptions = {}) {
  
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { category, featured, page = 1, limit = 20 } = options
  console.log("useProducts - category parameter:", category)
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })

        if (category) params.append("category", category)
        if (featured) params.append("featured", "true")

        const response = await fetch(`/api/products?${params}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, featured, page, limit])

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      // Re-trigger the effect
    },
  }
}
