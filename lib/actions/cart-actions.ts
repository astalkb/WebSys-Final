"use server"

import { prisma } from "@/lib/db";
import { Cart, CartItem } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getCart(): Promise<Cart | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return null;
    }

    // Get or create a cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const items: CartItem[] = cart.items.map((item: any) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return {
      id: cart.id,
      items,
      total,
    };
  } catch (error) {
    console.error("Error getting cart:", error);
    return null;
  }
}

export async function addToCart(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const productId = formData.get("productId") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 1;

    // First check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
          items: {
            create: {
              productId,
              quantity,
            },
          },
        },
        include: { items: { include: { product: true } } },
      });
    } else {
      // Check if item already exists in cart
      const existingItem = cart.items.find((item) => item.productId === productId);

      if (existingItem) {
        // Update quantity if item exists
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        // Add new item if it doesn't exist
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      // Get updated cart
      cart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { items: { include: { product: true } } },
      });
    }

    if (!cart) {
      throw new Error("Failed to create or update cart");
    }

    // Calculate total
    const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    revalidatePath("/cart");
    return { items: cart.items, total };
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function removeFromCart(formData: FormData) {
  try {
    const itemId = formData.get("itemId") as string;

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    revalidatePath("/cart");
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}

export async function updateCartItem(formData: FormData) {
  try {
    const itemId = formData.get("itemId") as string;
    const quantity = parseInt(formData.get("quantity") as string);

    if (quantity <= 0) {
      await removeFromCart(formData);
      return;
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    revalidatePath("/cart");
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
}