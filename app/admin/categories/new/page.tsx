"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewCategory {
  name: string;
}

export default function NewCategoryPage() {
  const [category, setCategory] = useState<NewCategory>({
    name: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (response.ok) {
        toast.success("Category created successfully");
        router.push("/admin/categories");
      } else {
        toast.error("Error creating category");
      }
    } catch (error) {
      toast.error("Error creating category");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">New Category</h1>
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
            <Button type="submit">Create Category</Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 