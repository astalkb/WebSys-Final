"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getPageContent(page: string) {
  try {
    const content = await prisma.pageContent.findUnique({
      where: { page },
    })
    return content?.content || null
  } catch (error) {
    console.error("Error fetching page content:", error)
    return null
  }
}

export async function updatePageContent(page: string, content: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return { success: false, error: "Forbidden - Admin access required" }
    }

    const updatedContent = await prisma.pageContent.upsert({
      where: { page },
      update: { content },
      create: { page, content },
    })

    // Revalidate both the about page and the specific content
    revalidatePath('/about')
    revalidatePath('/contact')
    
    return { success: true, data: updatedContent }
  } catch (error) {
    console.error("Error updating page content:", error)
    return { success: false, error: "Failed to update page content" }
  }
} 