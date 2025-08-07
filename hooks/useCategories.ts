"use client"

import { useState, useEffect } from "react"
import type { Category } from "@/types/product"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching categories...")

        const response = await fetch("/api/categories")

        console.log("Categories response status:", response.status)
        console.log("Categories response ok:", response.ok)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Categories API Error Response:", errorText)
          throw new Error(`Failed to fetch categories: ${response.status} ${errorText}`)
        }

        const data = await response.json()
        console.log("Categories data received:", data)

        setCategories(data || [])
      } catch (err) {
        console.error("Error in useCategories:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
