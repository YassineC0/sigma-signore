"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface AdminUser {
  id: string
  username: string
  name?: string
  role?: string
  token?: string
}

interface AdminAuthContextType {
  admin: AdminUser | null
  user: AdminUser | null // Alias for compatibility
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      console.log("Checking auth with token:", token ? "Token exists" : "No token")

      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch("/api/admin/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      console.log("Auth check response:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Auth check data:", data)

        if (data.isAuthenticated) {
          setAdmin({ ...data.user, token })
        } else {
          localStorage.removeItem("admin-token")
        }
      } else {
        console.log("Auth check failed, removing token")
        localStorage.removeItem("admin-token")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      localStorage.removeItem("admin-token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    try {
      console.log("Attempting login with:", { username, password })

      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      console.log("Login response status:", response.status)

      const data = await response.json()
      console.log("Login response data:", data)

      if (response.ok && data.success) {
        console.log("Login successful, storing token:", data.user.token)
        localStorage.setItem("admin-token", data.user.token)
        setAdmin(data.user)
        return { success: true }
      } else {
        console.log("Login failed:", data.error)
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login network error:", error)
      return { success: false, error: "Network error" }
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("admin-token")
      if (token) {
        await fetch("/api/admin/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("admin-token")
      setAdmin(null)
      router.push("/admin/login")
    }
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        user: admin, // Alias for compatibility
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}
