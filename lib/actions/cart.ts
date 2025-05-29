"use server"

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getCart() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return null
  }

  const cart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  return cart
}

export async function addToCart(productId: string, quantity: number = 1) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Get or create cart
  let cart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: session.user.id,
      },
    })
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  })

  if (existingItem) {
    // Update quantity if item exists
    await prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    })
  } else {
    // Add new item if it doesn't exist
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    })
  }

  return getCart()
}

export async function updateCartItem(itemId: string, quantity: number) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const cart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
  })

  if (!cart) {
    throw new Error("Cart not found")
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  })

  if (!item) {
    throw new Error("Item not found in cart")
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    })
  } else {
    await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
    })
  }

  return getCart()
}

export async function removeFromCart(itemId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const cart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
  })

  if (!cart) {
    throw new Error("Cart not found")
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cartId: cart.id,
    },
  })

  if (!item) {
    throw new Error("Item not found in cart")
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  })

  return getCart()
} 