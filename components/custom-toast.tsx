"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
  onClose: () => void
}

export function CustomToast({ message, type = "info", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />
      case "error":
        return <AlertCircle size={20} />
      case "warning":
        return <AlertTriangle size={20} />
      default:
        return <Info size={20} />
    }
  }

  const getColors = () => {
    switch (type) {
      case "success":
        return {
          bg: "#dcfce7",
          border: "#16a34a",
          text: "#15803d",
          icon: "#16a34a"
        }
      case "error":
        return {
          bg: "#fef2f2",
          border: "#ef4444",
          text: "#dc2626",
          icon: "#ef4444"
        }
      case "warning":
        return {
          bg: "#fef3c7",
          border: "#f59e0b",
          text: "#d97706",
          icon: "#f59e0b"
        }
      default:
        return {
          bg: "#dbeafe",
          border: "#3b82f6",
          text: "#1d4ed8",
          icon: "#3b82f6"
        }
    }
  }

  const colors = getColors()

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 10000,
        maxWidth: "400px",
        width: "calc(100vw - 40px)",
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ color: colors.icon, flexShrink: 0, marginTop: "2px" }}>
          {getIcon()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              fontWeight: "600",
              color: colors.text,
              lineHeight: "1.4",
              wordBreak: "break-word",
            }}
          >
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          style={{
            background: "none",
            border: "none",
            color: colors.text,
            cursor: "pointer",
            padding: "2px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent"
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<{
    id: string
    message: string
    type: "success" | "error" | "warning" | "info"
    duration?: number
  }>>([])

  const showToast = (message: string, type: "success" | "error" | "warning" | "info" = "info", duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div style={{ position: "fixed", top: 0, right: 0, zIndex: 10000 }}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            marginBottom: "10px",
            transform: `translateY(${index * 10}px)`,
          }}
        >
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  )

  return { showToast, ToastContainer }
}
