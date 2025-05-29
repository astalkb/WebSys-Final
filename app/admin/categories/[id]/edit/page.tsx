"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${params.id}`);
      if (!response.ok) throw new Error("Category not found");
      const data = await response.json();
      setCategory(data);
    } catch (error) {
      toast.error("Error fetching category");
      router.push("/admin/categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    try {
      const response = await fetch(`/api/categories/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (response.ok) {
        toast.success("Category updated successfully");
        router.push("/admin/categories");
      } else {
        toast.error("Error updating category");
      }
    } catch (error) {
      toast.error("Error updating category");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Category</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 