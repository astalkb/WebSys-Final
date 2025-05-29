"use client"

import { useState } from "react"
import { Footer } from "@/components/layout/footer"
import { ProductGrid } from "@/components/shop/product-grid"
import { ProductFilters } from "@/components/shop/product-filters"
import { ProductSort } from "@/components/shop/product-sort"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"

export default function ShopPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
  })
  const [sortBy, setSortBy] = useState("featured")

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shop</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <ProductSort value={sortBy} onChange={setSortBy} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <ProductFilters filters={filters} onChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid filters={filters} sortBy={sortBy} />
          </div>
        </div>
      </div>
    </main>
  )
}
