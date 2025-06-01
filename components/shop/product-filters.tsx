"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"

const categories = [
  { id: "vitamins", name: "Vitamins", count: 0 },
  { id: "supplements", name: "Supplements", count: 0 },
  { id: "health-packs", name: "Health Packs", count: 0 },
  { id: "beauty-products", name: "Beauty Products", count: 0 },
]

interface ProductFiltersProps {
  filters: {
    category: string
    priceRange: number[]
    rating: number
    inStock: boolean
  }
  onChange: (filters: {
    category: string
    priceRange: number[]
    rating: number
    inStock: boolean
  }) => void
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const updateFilter = (key: keyof typeof filters, value: string | number | boolean | number[]) => {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all" />
              <Label htmlFor="all">All Categories</Label>
            </div>
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={category.id} />
                <Label htmlFor={category.id} className="flex-1">
                  {category.name}
                </Label>
                <span className="text-sm text-gray-500">({category.count})</span>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle>Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value)}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Minimum Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={filters.rating.toString()}
            onValueChange={(value) => updateFilter("rating", Number.parseInt(value))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="rating-all" />
              <Label htmlFor="rating-all">All Ratings</Label>
            </div>
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  & Up
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilter("inStock", checked)}
            />
            <Label htmlFor="in-stock">In Stock Only</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
