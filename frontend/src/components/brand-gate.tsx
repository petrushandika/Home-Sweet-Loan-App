"use client"

import { useState, useEffect } from "react"
import { BrandLoader } from "@/components/brand-loader"

export function BrandGate({ 
  children,
  fixed 
}: { 
  children: React.ReactNode,
  fixed?: React.ReactNode 
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Artificial delay to show the brand identity
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500) // 2.5 seconds for a premium feel

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <BrandLoader />
  }

  return (
    <>
      <div className="animate-smooth-in min-h-screen">
        {children}
      </div>
      {fixed}
    </>
  )
}
