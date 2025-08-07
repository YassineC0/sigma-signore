export interface ProductVariant {
  id?: number // Optional for new variants, will be assigned by DB
  product_id?: number // Will be set on save
  size: string
  stock_quantity: number
  color?: string // New: color field
  image_url?: string // New: color-specific image
  created_at?: string
  updated_at?: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  promotion_price?: number // New: promotional price
  is_on_promotion?: boolean // New: promotion flag
  mainImage?: string // New: main display image (from first color variant or image1)
  image1?: string // Corrected to string | undefined
  image2?: string // Corrected to string | undefined
  image3?: string // Added for consistency
  image4?: string // Added for consistency
  category?: string
  rating?: number
  reviews?: number
  created_at?: string
  updated_at?: string
  cost?: number
  featured?: boolean
  in_stock?: boolean // Ensure this is present and optional
  variants?: ProductVariant[] // Added variants array
}

export interface Category {
  id: number
  name: string
  image?: string // Changed from image_url to image to match your schema
  description?: string
  created_at?: string
}

// New: Color interface for predefined colors
export interface ProductColor {
  name: string
  hex: string
}
