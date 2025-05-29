"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

interface DashboardNavProps {
  user: {
    role?: string
    name?: string
    email?: string
  } | null | undefined
}

export function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  const userNavItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Orders",
      href: "/dashboard/orders",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
    },
  ]

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin",
    },
    {
      title: "Products",
      href: "/admin/products",
    },
    {
      title: "Users",
      href: "/admin/users",
    },
    {
      title: "Categories",
      href: "/admin/categories",
    },
  ]

  const navItems = user?.role === "ADMIN" ? adminNavItems : userNavItems

  return (
    <nav className="flex flex-col w-64 border-r bg-background">
      <div className="p-6">
        <h2 className="text-lg font-semibold">
          {user?.role === "ADMIN" ? "Admin Panel" : "My Account"}
        </h2>
        {user?.name && (
          <p className="text-sm text-muted-foreground mt-1">{user.name}</p>
        )}
      </div>
      <div className="flex-1 px-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-muted"
              )}
              asChild
            >
              <Link href={item.href}>{item.title}</Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Logout
        </Button>
      </div>
    </nav>
  )
} 