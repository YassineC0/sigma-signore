"use client"
import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, ImageIcon } from 'lucide-react'
import Image from "next/image"

interface ImageUploadProps {
  currentImage?: string
  onImageUploaded: (url: string) => void
  label?: string
}

export function ImageUpload({ currentImage, onImageUploaded, label }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const token = localStorage.getItem("admin-token")

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onImageUploaded(data.url)
      } else {
        const error = await response.json()
        alert(error.error || "Échec du téléchargement")
      }
    } catch (error) {
      console.error("Erreur de téléchargement:", error)
      alert("Échec du téléchargement")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>{label}</label>}
      {currentImage ? (
        <div style={{ position: "relative", marginBottom: "10px" }}>
          <div
            style={{
              position: "relative",
              width: "200px",
              height: "150px",
              borderRadius: "8px",
              overflow: "hidden",
              border: "2px solid #e5e7eb",
            }}
          >
            <Image src={currentImage || "/placeholder.svg"} alt="Aperçu" fill style={{ objectFit: "cover" }} sizes="200px" />
          </div>
          <Button
            type="button"
            onClick={() => onImageUploaded("")}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              backgroundColor: "#ef4444",
              color: "white",
              padding: "4px",
              minWidth: "auto",
              height: "auto",
              borderRadius: "50%",
            }}
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "hsl(45 100% 51%)" : "#d1d5db"}`,
            borderRadius: "8px",
            padding: "40px 20px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: dragOver ? "#fffbe6" : "#f9fafb",
            transition: "all 0.2s",
            marginBottom: "10px",
          }}
        >
          {uploading ? (
            <div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #e5e7eb",
                  borderTop: "4px solid hsl(45 100% 51%)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 10px",
                }}
              />
              <p style={{ color: "#6b7280", fontSize: "14px" }}>Téléchargement...</p>
            </div>
          ) : (
            <div>
              <ImageIcon size={40} color="#9ca3af" style={{ margin: "0 auto 10px" }} />
              <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "5px" }}>
                Glissez & déposez une image ici, ou cliquez pour sélectionner
              </p>
              <p style={{ color: "#9ca3af", fontSize: "12px" }}>PNG, JPG, WebP jusqu'à 5 Mo</p>
            </div>
          )}
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} style={{ display: "none" }} />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
