"use client"

import { useState, useEffect } from "react"

interface DeliveryCity {
  Réf: string
  Ville: string
  "Frais livraison": string
  "Frais Retour": string
}

export function useDeliveryCities() {
  const [cities, setCities] = useState<DeliveryCity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/delivery-cities")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de la récupération des villes")
        }

        setCities(data.cities)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue")
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

  return { cities, loading, error }
}
