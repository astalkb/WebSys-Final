"use server"

import { prisma } from "@/lib/db";
import { getCart } from "./cart";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CartItem, Product, OrderStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type CartItemWithProduct = CartItem & {
  product: Product;
};

type CartWithItems = {
  id: string;
  items: CartItemWithProduct[];
};

interface OrderItem {
  productId: string
  quantity: number
  price: number
}

interface ShippingInfo {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
}

interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
}

export async function createOrder(total: number, items: OrderItem[], shippingInfo: ShippingInfo, paymentInfo: PaymentInfo) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    // Create the order with the authenticated user's ID
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total,
        status: OrderStatus.PROCESSING,
        shippingInfo,
        paymentInfo,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      data: {
        status
      },
    });

    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
}

export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    return orders
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw new Error("Failed to fetch orders")
  }
}

export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error("User not authenticated")
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    return orders
  } catch (error) {
    console.error("Error fetching user orders:", error)
    throw new Error("Failed to fetch user orders")
  }
} 