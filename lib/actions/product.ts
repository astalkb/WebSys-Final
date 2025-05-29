"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const stock = parseInt(formData.get("stock") as string);
    const images = formData.get("images") as string;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId,
        stock,
        images: JSON.parse(images),
      },
    });

    revalidatePath("/admin/products");
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryId = formData.get("categoryId") as string;
    const stock = parseInt(formData.get("stock") as string);
    const images = formData.get("images") as string;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        categoryId,
        stock,
        images: JSON.parse(images),
      },
    });

    revalidatePath("/admin/products");
    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}

export async function updateStock(id: string, stock: number) {
  await prisma.product.update({
    where: { id },
    data: { stock },
  });

  revalidatePath("/admin/inventory");
} 