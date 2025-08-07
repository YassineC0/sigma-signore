"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !admin && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [admin, loading, router, pathname])

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "18px",
          color: "hsl(45 100% 51%)",
        }}
      >
        Chargement...
      </div>
    )
  }

  if (!admin && pathname !== "/admin/login") {
    return null
  }

  // Admin panel without header - just render children directly
  return <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>{children}</div>
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  )
}
