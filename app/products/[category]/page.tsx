"use client"
import { CategoryProductsPage } from "@/components/category-products-page"
import { useCategories } from "@/hooks/useCategories"
import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation" // Import useParams

type PageProps = {}

export default function DynamicCategoryPage({}: PageProps) {
  // Remove params from props
  const params = useParams() // Use useParams hook
  const categorySlug = params.category as string // Get the slug from useParams
  const [categoryData, setCategoryData] = useState<{ name: string; title: string } | null>(null)
  const { categories, loading, error } = useCategories()

  // Helper function to create URL-friendly slugs (must be consistent with ModernCategories)
  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  useEffect(() => {
    if (!loading && categories.length > 0 && categorySlug) {
      // Find the category by matching its generated slug with the URL slug
      const matchingCategory = categories.find((cat) => createSlug(cat.name) === categorySlug)

      if (matchingCategory) {
        setCategoryData({
          name: matchingCategory.name.trim(), // Use the exact trimmed name from DB
          title: matchingCategory.name.trim(),
        })
      } else {
        // If no matching category found, trigger 404
        notFound()
      }
    } else if (!loading && !categorySlug) {
      // If no category slug is provided, also trigger 404 or redirect to /products
      notFound()
    }
  }, [categories, loading, categorySlug]) // Depend on categories, loading, and categorySlug

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "90px",
        }}
      >
        <div>Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "90px",
          color: "#ef4444",
        }}
      >
        <div>Erreur lors du chargement des catégories: {error}</div>
      </div>
    )
  }

  // Only render CategoryProductsPage if categoryData is available
  if (!categoryData) {
    // This case should ideally be caught by notFound() above,
    // but as a fallback during async loading, we can show loading or null
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "90px",
        }}
      >
        <div>Chargement de la catégorie...</div>
      </div>
    )
  }

  return <CategoryProductsPage category={categoryData.name} title={categoryData.title} />
}
