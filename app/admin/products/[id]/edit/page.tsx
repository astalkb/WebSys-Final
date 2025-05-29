"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  categoryId: string;
  images: string[];
}

export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error("Error fetching product");
      router.push("/admin/products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Error fetching categories");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    if (!product.name || !product.description || !product.categoryId) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...product,
          images: product.images.length > 0 ? product.images : ["/placeholder.png"],
        }),
      });

      if (response.ok) {
        toast.success("Product updated successfully");
        router.push("/admin/products");
      } else {
        const error = await response.json();
        toast.error(error.message || "Error updating product");
      }
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={product.categoryId}
                onValueChange={(value) =>
                  setProduct({ ...product, categoryId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={product.price}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    price: parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={product.stock}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    stock: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={product.status}
                onValueChange={(value) =>
                  setProduct({ ...product, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="text"
                placeholder="Enter image URL"
                value={product.images[0] || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    images: [e.target.value],
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              Cancel
            </Button>
            <Button type="submit">Update Product</Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 