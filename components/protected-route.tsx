"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/login?redirect=${pathname}`)
      } else if (requireAdmin && user.role !== 'admin') {
        router.push('/')
      }
    }
  }, [user, isLoading, requireAdmin, router, pathname])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || (requireAdmin && user.role !== 'admin')) {
    return null
  }

  return <>{children}</>
} 