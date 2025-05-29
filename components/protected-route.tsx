"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login')
      } else if (requireAdmin && user.role !== 'admin') {
        router.push('/')
      }
    }
  }, [user, isLoading, requireAdmin, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || (requireAdmin && user.role !== 'admin')) {
    return null
  }

  return <>{children}</>
} 