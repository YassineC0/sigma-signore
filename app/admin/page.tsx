"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { Plus, Edit, Trash2, LogOut, FolderPlus, X, Minus } from 'lucide-react'
import Image from "next/image"
import { ImageUpload } from "@/components/admin/image-upload"
import { ToggleSwitch } from "@/components/admin/toggle-switch"
import type { Product, ProductVariant, Category, ProductColor } from "@/types/product"

const ALL_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"]

// 20 predefined colors
const PREDEFINED_COLORS: ProductColor[] = [
  { name: "Rouge", hex: "#FF0000" },
  { name: "Bleu", hex: "#0000FF" },
  { name: "Vert", hex: "#008000" },
  { name: "Jaune", hex: "#FFFF00" },
  { name: "Orange", hex: "#FFA500" },
  { name: "Violet", hex: "#800080" },
  { name: "Rose", hex: "#FFC0CB" },
  { name: "Marron", hex: "#A52A2A" },
  { name: "Noir", hex: "#000000" },
  { name: "Blanc", hex: "#FFFFFF" },
  { name: "Gris", hex: "#808080" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Marine", hex: "#000080" },
  { name: "Turquoise", hex: "#40E0D0" },
  { name: "Bordeaux", hex: "#800020" },
  { name: "Kaki", hex: "#F0E68C" },
  { name: "Corail", hex: "#FF7F50" },
  { name: "Lavande", hex: "#E6E6FA" },
  { name: "Menthe", hex: "#98FB98" },
  { name: "Crème", hex: "#FFFDD0" },
]

export default function AdminDashboard() {
  const { admin, logout, user } = useAdminAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    promotion_price: "",
    is_on_promotion: false,
    category: "",
    cost: "",
    featured: false,
    in_stock: true,
    image1: "",
    image2: "",
    image3: "",
    image4: "",
  })

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: "",
  })

  // Variants state - now includes colors
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [colorImages, setColorImages] = useState<{ [color: string]: string }>({})

  useEffect(() => {
    if (admin) {
      fetchProducts()
      fetchCategories()
    }
  }, [admin])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      const response = await fetch("/api/admin/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      promotion_price: "",
      is_on_promotion: false,
      category: "",
      cost: "",
      featured: false,
      in_stock: true,
      image1: "",
      image2: "",
      image3: "",
      image4: "",
    })
    setVariants([])
    setSelectedColors([])
    setColorImages({})
    setEditingProduct(null)
  }

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      image: "",
    })
    setEditingCategory(null)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      promotion_price: product.promotion_price?.toString() || "",
      is_on_promotion: product.is_on_promotion || false,
      category: product.category || "",
      cost: product.cost?.toString() || "",
      featured: product.featured || false,
      in_stock: product.in_stock !== false,
      image1: product.image1 || "",
      image2: product.image2 || "",
      image3: product.image3 || "",
      image4: product.image4 || "",
    })
    
    // Load existing variants
    if (product.variants) {
      setVariants(product.variants)
      
      // Extract colors and their images
      const colors = Array.from(new Set(product.variants.filter(v => v.color).map(v => v.color!)))
      setSelectedColors(colors)
      
      const colorImageMap: { [color: string]: string } = {}
      product.variants.forEach(variant => {
        if (variant.color && variant.image_url) {
          colorImageMap[variant.color] = variant.image_url
        }
      })
      setColorImages(colorImageMap)
    }
    
    setShowProductForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    })
    setShowCategoryForm(true)
  }

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const token = localStorage.getItem("admin-token")
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          fetchProducts()
        }
      } catch (error) {
        console.error("Error deleting product:", error)
      }
    }
  }

  const handleDeleteCategory = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        const token = localStorage.getItem("admin-token")
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          fetchCategories()
        }
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  const handleColorSelection = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      // Remove color
      setSelectedColors(prev => prev.filter(c => c !== colorName))
      setColorImages(prev => {
        const newImages = { ...prev }
        delete newImages[colorName]
        return newImages
      })
      // Remove variants for this color
      setVariants(prev => prev.filter(v => v.color !== colorName))
    } else {
      // Add color
      setSelectedColors(prev => [...prev, colorName])
      // Add variants for this color (all sizes with 0 stock initially)
      const newVariants = ALL_SIZES.map(size => ({
        size,
        stock_quantity: 0,
        color: colorName,
        image_url: ""
      }))
      setVariants(prev => [...prev, ...newVariants])
    }
  }

  const handleColorImageUpload = (colorName: string, imageUrl: string) => {
    setColorImages(prev => ({ ...prev, [colorName]: imageUrl }))
    // Update all variants of this color with the new image
    setVariants(prev => prev.map(variant => 
      variant.color === colorName 
        ? { ...variant, image_url: imageUrl }
        : variant
    ))
  }

  const updateVariantStock = (color: string | undefined, size: string, stock: number) => {
    setVariants(prev => prev.map(variant => 
      variant.color === color && variant.size === size
        ? { ...variant, stock_quantity: Math.max(0, stock) }
        : variant
    ))
  }

  const incrementStock = (color: string | undefined, size: string) => {
    const variant = variants.find(v => v.color === color && v.size === size)
    const currentStock = variant?.stock_quantity || 0
    updateVariantStock(color, size, currentStock + 1)
  }

  const decrementStock = (color: string | undefined, size: string) => {
    const variant = variants.find(v => v.color === color && v.size === size)
    const currentStock = variant?.stock_quantity || 0
    updateVariantStock(color, size, Math.max(0, currentStock - 1))
  }

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Prepare variants data
      let finalVariants: ProductVariant[] = []
      
      if (selectedColors.length > 0) {
        // Product has colors - include all color-size combinations
        finalVariants = selectedColors.flatMap(colorName => 
          ALL_SIZES.map(size => {
            const variant = variants.find(v => v.color === colorName && v.size === size)
            return {
              size,
              stock_quantity: variant?.stock_quantity || 0,
              color: colorName,
              image_url: colorImages[colorName] || null,
            }
          })
        )
      } else {
        // Product has no colors - include only sizes with stock
        finalVariants = ALL_SIZES.map(size => {
          const variant = variants.find(v => !v.color && v.size === size)
          return {
            size,
            stock_quantity: variant?.stock_quantity || 0,
            color: null,
            image_url: null,
          }
        }).filter(v => v.stock_quantity > 0) // Only include sizes with stock
      }

      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        promotion_price: productForm.promotion_price ? parseFloat(productForm.promotion_price) : null,
        cost: productForm.cost ? parseFloat(productForm.cost) : null,
        variants: finalVariants,
      }

      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products"
      const method = editingProduct ? "PUT" : "POST"
      const token = localStorage.getItem("admin-token")

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        fetchProducts()
        setShowProductForm(false)
        resetProductForm()
        alert(editingProduct ? "Produit mis à jour avec succès!" : "Produit créé avec succès!")
      } else {
        const error = await response.text()
        alert(`Erreur: ${error}`)
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Erreur lors de la sauvegarde du produit")
    }
  }

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories"
      const method = editingCategory ? "PUT" : "POST"
      const token = localStorage.getItem("admin-token")

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryForm),
      })

      if (response.ok) {
        fetchCategories()
        setShowCategoryForm(false)
        resetCategoryForm()
        alert(editingCategory ? "Catégorie mise à jour avec succès!" : "Catégorie créée avec succès!")
      } else {
        const error = await response.text()
        alert(`Erreur: ${error}`)
      }
    } catch (error) {
      console.error("Error saving category:", error)
      alert("Erreur lors de la sauvegarde de la catégorie")
    }
  }

  if (!admin) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "10px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header - Mobile Optimized */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            marginBottom: "20px",
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
              Admin
            </h1>
            <button
              onClick={logout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              <LogOut size={14} />
              Déconnexion
            </button>
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Bienvenue, {user?.username}
          </div>
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => { setShowProductForm(true); resetProductForm(); }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#2A555A",
              color: "white",
              border: "none",
              padding: "14px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              width: "100%",
            }}
          >
            <Plus size={18} />
            Ajouter un produit
          </button>
          <button
            onClick={() => { setShowCategoryForm(true); resetCategoryForm(); }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              padding: "14px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "600",
              width: "100%",
            }}
          >
            <FolderPlus size={18} />
            Ajouter une catégorie
          </button>
        </div>

        {/* Products Section - Mobile Optimized */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "15px" }}>
            Produits ({products.length})
          </h2>
          
          {loading ? (
            <p>Chargement des produits...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "15px" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "12px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div style={{ position: "relative", width: "100%", height: "180px", marginBottom: "10px" }}>
                    <Image
                      src={product.mainImage || product.image1 || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                    />
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>{product.name}</h3>
                  
                  {/* Price with promotion display */}
                  <div style={{ marginBottom: "6px" }}>
                    {product.is_on_promotion && product.promotion_price ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <p style={{ fontSize: "12px", color: "#ff4444", fontWeight: "600", margin: 0 }}>
                          Prix promo: {product.promotion_price} DHS
                        </p>
                        <p style={{ fontSize: "10px", color: "#6b7280", textDecoration: "line-through", margin: 0 }}>
                          {product.price} DHS
                        </p>
                        <span style={{ 
                          backgroundColor: "#ff4444", 
                          color: "white", 
                          fontSize: "8px", 
                          padding: "2px 4px", 
                          borderRadius: "3px",
                          fontWeight: "600"
                        }}>
                          PROMO
                        </span>
                      </div>
                    ) : (
                      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "0" }}>
                        Prix: {product.price} DHS
                      </p>
                    )}
                  </div>
                  
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
                    Catégorie: {product.category}
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}>
                    Stock: {product.in_stock ? "En stock" : "Rupture"}
                  </p>
                  
                  {/* Show color variants if any */}
                  {product.variants && product.variants.some(v => v.color) && (
                    <div style={{ marginBottom: "10px" }}>
                      <p style={{ fontSize: "10px", color: "#6b7280", marginBottom: "4px" }}>Couleurs:</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
                        {Array.from(new Set(product.variants.filter(v => v.color).map(v => v.color!))).map(color => (
                          <span
                            key={color}
                            style={{
                              fontSize: "8px",
                              backgroundColor: "#e5e7eb",
                              padding: "2px 4px",
                              borderRadius: "3px",
                            }}
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "11px",
                        flex: 1,
                      }}
                    >
                      <Edit size={12} />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "11px",
                        flex: 1,
                      }}
                    >
                      <Trash2 size={12} />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories Section - Mobile Optimized */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1f2937", marginBottom: "15px" }}>
            Catégories ({categories.length})
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px" }}>
            {categories.map((category) => (
              <div
                key={category.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#fafafa",
                }}
              >
                {category.image && (
                  <div style={{ position: "relative", width: "100%", height: "100px", marginBottom: "10px" }}>
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                    />
                  </div>
                )}
                <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>{category.name}</h3>
                {category.description && (
                  <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "10px" }}>
                    {category.description}
                  </p>
                )}
                
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => handleEditCategory(category)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "11px",
                      flex: 1,
                    }}
                  >
                    <Edit size={12} />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "11px",
                      flex: 1,
                    }}
                  >
                    <Trash2 size={12} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Form Modal - Mobile Optimized */}
      {showProductForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            zIndex: 1000,
            padding: "10px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              width: "100%",
              maxWidth: "500px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
                {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
              </h3>
              <button
                onClick={() => {
                  setShowProductForm(false)
                  resetProductForm()
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Basic Info Section */}
              <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#2A555A" }}>
                  Informations de base
                </h4>
                
                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                    Description
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "16px",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                      Prix (DHS)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                      Coût (DHS)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.cost}
                      onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                    Catégorie
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "16px",
                      boxSizing: "border-box",
                    }}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Promotion Section */}
              <div style={{ backgroundColor: "#fff3cd", padding: "15px", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#856404" }}>
                  Promotion
                </h4>
                
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px" }}>
                  <ToggleSwitch
                    label=""
                    checked={productForm.is_on_promotion}
                    onChange={(checked) => setProductForm({ ...productForm, is_on_promotion: checked })}
                  />
                  <label style={{ fontWeight: "600", color: "#856404", fontSize: "14px" }}>
                    Activer la promotion
                  </label>
                </div>
                
                {productForm.is_on_promotion && (
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                      Prix promotionnel (DHS)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.promotion_price}
                      onChange={(e) => setProductForm({ ...productForm, promotion_price: e.target.value })}
                      required={productForm.is_on_promotion}
                      style={{
                        width: "100%",
                        padding: "12px",
                        border: "2px solid #ffc107",
                        borderRadius: "8px",
                        fontSize: "16px",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Images Section - Only show if no colors are selected */}
              {selectedColors.length === 0 && (
                <div style={{ backgroundColor: "#e3f2fd", padding: "15px", borderRadius: "8px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#1565c0" }}>
                    Images du produit
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#1565c0", fontWeight: "600" }}>
                        Image principale
                      </label>
                      <ImageUpload
                        onImageUploaded={(url) => setProductForm({ ...productForm, image1: url })}
                        currentImage={productForm.image1}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#1565c0", fontWeight: "600" }}>
                        Image 2
                      </label>
                      <ImageUpload
                        onImageUploaded={(url) => setProductForm({ ...productForm, image2: url })}
                        currentImage={productForm.image2}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#1565c0", fontWeight: "600" }}>
                        Image 3
                      </label>
                      <ImageUpload
                        onImageUploaded={(url) => setProductForm({ ...productForm, image3: url })}
                        currentImage={productForm.image3}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "#1565c0", fontWeight: "600" }}>
                        Image 4
                      </label>
                      <ImageUpload
                        onImageUploaded={(url) => setProductForm({ ...productForm, image4: url })}
                        currentImage={productForm.image4}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Color Selection */}
              <div style={{ backgroundColor: "#f3e5f5", padding: "15px", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#7b1fa2" }}>
                  Couleurs disponibles (optionnel)
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px", marginBottom: "15px" }}>
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorSelection(color.name)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                        padding: "8px",
                        border: selectedColors.includes(color.name) ? "3px solid #7b1fa2" : "2px solid #e5e7eb",
                        backgroundColor: selectedColors.includes(color.name) ? "#f3e5f5" : "white",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "10px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          backgroundColor: color.hex,
                          border: "1px solid #ccc",
                        }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>

                {/* Color Images - Only show for selected colors */}
                {selectedColors.length > 0 && (
                  <div>
                    <h5 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#7b1fa2" }}>
                      Images par couleur (obligatoire)
                    </h5>
                    <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                      {selectedColors.map((colorName) => (
                        <div key={colorName} style={{ border: "2px solid #e5e7eb", borderRadius: "8px", padding: "12px" }}>
                          <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "600", color: "#7b1fa2" }}>
                            Image pour {colorName}
                          </label>
                          <ImageUpload
                            onImageUploaded={(url) => handleColorImageUpload(colorName, url)}
                            currentImage={colorImages[colorName]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Management - Mobile Friendly */}
              <div style={{ backgroundColor: "#e8f5e8", padding: "15px", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#2e7d32" }}>
                  Gestion des tailles et stock
                </h4>
                
                {selectedColors.length > 0 ? (
                  // With colors: show stock for each color-size combination
                  <div>
                    {selectedColors.map((colorName) => (
                      <div key={colorName} style={{ marginBottom: "20px", border: "2px solid #4caf50", borderRadius: "8px", padding: "12px", backgroundColor: "white" }}>
                        <h5 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#2e7d32" }}>
                          Stock pour {colorName}
                        </h5>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px" }}>
                          {ALL_SIZES.map((size) => {
                            const variant = variants.find(v => v.color === colorName && v.size === size)
                            const currentStock = variant?.stock_quantity || 0
                            return (
                              <div key={`${colorName}-${size}`} style={{ textAlign: "center" }}>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: "#2e7d32" }}>
                                  {size}
                                </label>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                                  <button
                                    type="button"
                                    onClick={() => decrementStock(colorName, size)}
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      backgroundColor: "#f44336",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span style={{ 
                                    minWidth: "30px", 
                                    textAlign: "center", 
                                    fontSize: "14px", 
                                    fontWeight: "600",
                                    color: "#2e7d32"
                                  }}>
                                    {currentStock}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => incrementStock(colorName, size)}
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      backgroundColor: "#4caf50",
                                      color: "white",
                                      border: "none",
                                      borderRadius: "6px",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Without colors: show stock for each size only
                  <div style={{ border: "2px solid #4caf50", borderRadius: "8px", padding: "12px", backgroundColor: "white" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "10px" }}>
                      {ALL_SIZES.map((size) => {
                        const variant = variants.find(v => !v.color && v.size === size)
                        const currentStock = variant?.stock_quantity || 0
                        return (
                          <div key={size} style={{ textAlign: "center" }}>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "6px", color: "#2e7d32" }}>
                              {size}
                            </label>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                              <button
                                type="button"
                                onClick={() => {
                                  const newStock = Math.max(0, currentStock - 1)
                                  const existingVariantIndex = variants.findIndex(v => !v.color && v.size === size)
                                  if (existingVariantIndex >= 0) {
                                    setVariants(prev => prev.map((v, i) => 
                                      i === existingVariantIndex ? { ...v, stock_quantity: newStock } : v
                                    ))
                                  } else if (newStock > 0) {
                                    setVariants(prev => [...prev, { size, stock_quantity: newStock, color: null, image_url: null }])
                                  }
                                }}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  backgroundColor: "#f44336",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Minus size={16} />
                              </button>
                              <span style={{ 
                                minWidth: "30px", 
                                textAlign: "center", 
                                fontSize: "14px", 
                                fontWeight: "600",
                                color: "#2e7d32"
                              }}>
                                {currentStock}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newStock = currentStock + 1
                                  const existingVariantIndex = variants.findIndex(v => !v.color && v.size === size)
                                  if (existingVariantIndex >= 0) {
                                    setVariants(prev => prev.map((v, i) => 
                                      i === existingVariantIndex ? { ...v, stock_quantity: newStock } : v
                                    ))
                                  } else {
                                    setVariants(prev => [...prev, { size, stock_quantity: newStock, color: null, image_url: null }])
                                  }
                                }}
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  backgroundColor: "#4caf50",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div style={{ backgroundColor: "#fff8e1", padding: "15px", borderRadius: "8px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "15px", color: "#f57c00" }}>
                  Paramètres
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label style={{ fontWeight: "600", color: "#f57c00", fontSize: "14px" }}>
                      Produit vedette
                    </label>
                    <ToggleSwitch
                      label=""
                      checked={productForm.featured}
                      onChange={(checked) => setProductForm({ ...productForm, featured: checked })}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <label style={{ fontWeight: "600", color: "#f57c00", fontSize: "14px" }}>
                      En stock
                    </label>
                    <ToggleSwitch
                      label=""
                      checked={productForm.in_stock}
                      onChange={(checked) => setProductForm({ ...productForm, in_stock: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "15px 20px",
                    backgroundColor: "#2A555A",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    width: "100%",
                  }}
                >
                  {editingProduct ? "Mettre à jour le produit" : "Créer le produit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false)
                    resetProductForm()
                  }}
                  style={{
                    padding: "15px 20px",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    width: "100%",
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal - Mobile Optimized */}
      {showCategoryForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "10px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "20px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0 }}>
                {editingCategory ? "Modifier la catégorie" : "Ajouter une catégorie"}
              </h3>
              <button
                onClick={() => {
                  setShowCategoryForm(false)
                  resetCategoryForm()
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Nom de la catégorie
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "16px",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "14px" }}>
                  Image de la catégorie
                </label>
                <ImageUpload
                  onImageUploaded={(url) => setCategoryForm({ ...categoryForm, image: url })}
                  currentImage={categoryForm.image}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
                <button
                  type="submit"
                  style={{
                    padding: "15px 20px",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    width: "100%",
                  }}
                >
                  {editingCategory ? "Mettre à jour la catégorie" : "Créer la catégorie"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false)
                    resetCategoryForm()
                  }}
                  style={{
                    padding: "15px 20px",
                    border: "2px solid #d1d5db",
                    backgroundColor: "white",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "16px",
                    width: "100%",
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
