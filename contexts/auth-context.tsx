"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Initialize user from localStorage after mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock login - in real app, this would be an API call
      if (email === "admin@example.com" && password === "admin") {
        const userData: User = {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        return true
      } else if (email === "user@example.com" && password === "user") {
        const userData: User = {
          id: 2,
          name: "John Doe",
          email: "user@example.com",
          role: "user",
        }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        return true
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        })
        return false
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration
      const userData: User = {
        id: Date.now(),
        name,
        email,
        role: "user",
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      })
      return true
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during registration.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
