"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import { Plus, Edit, Trash2, LogOut, FolderPlus, X } from 'lucide-react'
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
        ? { ...variant, stock_quantity: stock }
        : variant
    ))
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
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
            Tableau de bord Admin
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ color: "#6b7280" }}>Bienvenue, {user?.username}</span>
            <button
              onClick={logout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
          <button
            onClick={() => { setShowProductForm(true); resetProductForm(); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#2A555A",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <Plus size={16} />
            Ajouter un produit
          </button>
          <button
            onClick={() => { setShowCategoryForm(true); resetCategoryForm(); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#059669",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <FolderPlus size={16} />
            Ajouter une catégorie
          </button>
        </div>

        {/* Products Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "30px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
            Produits ({products.length})
          </h2>
          
          {loading ? (
            <p>Chargement des produits...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "16px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <div style={{ position: "relative", width: "100%", height: "200px", marginBottom: "12px" }}>
                    <Image
                      src={product.mainImage || product.image1 || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                    />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>{product.name}</h3>
                  
                  {/* Price with promotion display */}
                  <div style={{ marginBottom: "8px" }}>
                    {product.is_on_promotion && product.promotion_price ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <p style={{ fontSize: "14px", color: "#ff4444", fontWeight: "600", margin: 0 }}>
                          Prix promo: {product.promotion_price} DHS
                        </p>
                        <p style={{ fontSize: "12px", color: "#6b7280", textDecoration: "line-through", margin: 0 }}>
                          {product.price} DHS
                        </p>
                        <span style={{ 
                          backgroundColor: "#ff4444", 
                          color: "white", 
                          fontSize: "10px", 
                          padding: "2px 6px", 
                          borderRadius: "3px",
                          fontWeight: "600"
                        }}>
                          PROMO
                        </span>
                      </div>
                    ) : (
                      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "0" }}>
                        Prix: {product.price} DHS
                      </p>
                    )}
                  </div>
                  
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                    Catégorie: {product.category}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>
                    Stock: {product.in_stock ? "En stock" : "Rupture"}
                  </p>
                  
                  {/* Show color variants if any */}
                  {product.variants && product.variants.some(v => v.color) && (
                    <div style={{ marginBottom: "12px" }}>
                      <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Couleurs:</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {Array.from(new Set(product.variants.filter(v => v.color).map(v => v.color!))).map(color => (
                          <span
                            key={color}
                            style={{
                              fontSize: "10px",
                              backgroundColor: "#e5e7eb",
                              padding: "2px 6px",
                              borderRadius: "3px",
                            }}
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEditProduct(product)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
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
                        gap: "4px",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
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

        {/* Categories Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1f2937", marginBottom: "20px" }}>
            Catégories ({categories.length})
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
            {categories.map((category) => (
              <div
                key={category.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  backgroundColor: "#fafafa",
                }}
              >
                {category.image && (
                  <div style={{ position: "relative", width: "100%", height: "120px", marginBottom: "12px" }}>
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      style={{ objectFit: "cover", borderRadius: "6px" }}
                    />
                  </div>
                )}
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>{category.name}</h3>
                {category.description && (
                  <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "12px" }}>
                    {category.description}
                  </p>
                )}
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEditCategory(category)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
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
                      gap: "4px",
                      backgroundColor: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "12px",
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

      {/* Product Form Modal */}
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
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
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
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Nom du produit</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Prix (DHS)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Coût (DHS)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.cost}
                    onChange={(e) => setProductForm({ ...productForm, cost: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              {/* Promotion Section */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <ToggleSwitch
                    checked={productForm.is_on_promotion}
                    onChange={(checked) => setProductForm({ ...productForm, is_on_promotion: checked })}
                  />
                  <label style={{ fontWeight: "600", color: "#1f2937" }}>Activer la promotion</label>
                </div>
                
                {productForm.is_on_promotion && (
                  <div>
                    <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Prix promotionnel (DHS)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.promotion_price}
                      onChange={(e) => setProductForm({ ...productForm, promotion_price: e.target.value })}
                      required={productForm.is_on_promotion}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        border: "1px solid #d1d5db",
                        borderRadius: "4px",
                        fontSize: "14px",
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Catégorie</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
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

              {/* Product Images - Only show if no colors are selected */}
              {selectedColors.length === 0 && (
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Images du produit</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#6b7280" }}>
                        Image principale
                      </label>
                      <ImageUpload
                        onImageUploaded={(url) => setProductForm({ ...productForm, image1: url })}
                        currentImage={productForm.image1}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#6b7280" }}>
                        Image 2
                      </label>
                      <ImageUpload
                        onImageUploaded={(url) => setProductForm({ ...productForm, image2: url })}
                        currentImage={productForm.image2}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#6b7280" }}>
                        Image 3
                      </label>
                      <ImageUpload
                        onImageUploaded={(url) => setProductForm({ ...productForm, image3: url })}
                        currentImage={productForm.image3}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", color: "#6b7280" }}>
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
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Couleurs disponibles (optionnel)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "8px", marginBottom: "16px" }}>
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleColorSelection(color.name)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 8px",
                        border: selectedColors.includes(color.name) ? "2px solid #2A555A" : "1px solid #d1d5db",
                        backgroundColor: selectedColors.includes(color.name) ? "#f0fdf4" : "white",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "2px",
                          backgroundColor: color.hex,
                          border: "1px solid #ccc",
                          flexShrink: 0,
                        }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>

                {/* Color Images - Only show for selected colors */}
                {selectedColors.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
                      Images par couleur (obligatoire)
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                      {selectedColors.map((colorName) => (
                        <div key={colorName} style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px" }}>
                          <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: "600" }}>
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

              {/* Size and Stock Management */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Gestion des tailles et stock
                </label>
                
                {selectedColors.length > 0 ? (
                  // With colors: show stock for each color-size combination
                  <div>
                    {selectedColors.map((colorName) => (
                      <div key={colorName} style={{ marginBottom: "20px", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#2A555A" }}>
                          Stock pour {colorName}
                        </h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "8px" }}>
                          {ALL_SIZES.map((size) => {
                            const variant = variants.find(v => v.color === colorName && v.size === size)
                            return (
                              <div key={`${colorName}-${size}`}>
                                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                                  {size}
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={variant?.stock_quantity || 0}
                                  onChange={(e) => updateVariantStock(colorName, size, parseInt(e.target.value) || 0)}
                                  style={{
                                    width: "100%",
                                    padding: "4px 6px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "3px",
                                    fontSize: "12px",
                                  }}
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Without colors: show stock for each size only
                  <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "8px" }}>
                      {ALL_SIZES.map((size) => {
                        const variant = variants.find(v => !v.color && v.size === size)
                        return (
                          <div key={size}>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px" }}>
                              {size}
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={variant?.stock_quantity || 0}
                              onChange={(e) => {
                                const stock = parseInt(e.target.value) || 0
                                const existingVariantIndex = variants.findIndex(v => !v.color && v.size === size)
                                if (existingVariantIndex >= 0) {
                                  setVariants(prev => prev.map((v, i) => 
                                    i === existingVariantIndex ? { ...v, stock_quantity: stock } : v
                                  ))
                                } else {
                                  setVariants(prev => [...prev, { size, stock_quantity: stock, color: null, image_url: null }])
                                }
                              }}
                              style={{
                                width: "100%",
                                padding: "4px 6px",
                                border: "1px solid #d1d5db",
                                borderRadius: "3px",
                                fontSize: "12px",
                              }}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Produit vedette</label>
                  <ToggleSwitch
                    checked={productForm.featured}
                    onChange={(checked) => setProductForm({ ...productForm, featured: checked })}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>En stock</label>
                  <ToggleSwitch
                    checked={productForm.in_stock}
                    onChange={(checked) => setProductForm({ ...productForm, in_stock: checked })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductForm(false)
                    resetProductForm()
                  }}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2A555A",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {editingProduct ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
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
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "24px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
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
                  padding: "4px",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Nom de la catégorie</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    fontSize: "14px",
                    resize: "vertical",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "600" }}>Image de la catégorie</label>
                <ImageUpload
                  onImageUploaded={(url) => setCategoryForm({ ...categoryForm, image: url })}
                  currentImage={categoryForm.image}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "20px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false)
                    resetCategoryForm()
                  }}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#059669",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  {editingCategory ? "Mettre à jour" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
