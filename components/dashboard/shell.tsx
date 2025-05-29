import * as React from "react"

export function DashboardShell({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6" {...props}>
      {children}
    </div>
  )
} 