import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.category.create({
    data: {
      name,
      description,
    },
  });

  revalidatePath("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.category.update({
    where: { id },
    data: {
      name,
      description,
    },
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
} 