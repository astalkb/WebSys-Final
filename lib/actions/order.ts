"use server"

import { prisma } from "@/lib/prisma";
import { getCart } from "./cart";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CartItem, Product } from "@prisma/client";

type CartItemWithProduct = CartItem & {
  product: Product;
};

type CartWithItems = {
  id: string;
  items: CartItemWithProduct[];
};

export async function createOrder(formData: FormData) {
  const cart = await getCart() as CartWithItems | null;
  
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const shippingInfo = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    postalCode: formData.get("postalCode") as string,
  };

  const paymentInfo = {
    cardNumber: formData.get("cardNumber") as string,
    expiryDate: formData.get("expiryDate") as string,
    cvv: formData.get("cvv") as string,
  };

  // Calculate total from cart items
  const total = cart.items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  // In a real application, you would process the payment here
  // For this example, we'll just create the order

  const order = await prisma.order.create({
    data: {
      userId: "user-id", // This should come from the authenticated user
      total,
      shippingInfo: shippingInfo as any,
      paymentInfo: paymentInfo as any,
      items: {
        create: cart.items.map((item: CartItemWithProduct) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      },
    },
  });

  // Clear the cart after successful order
  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  revalidatePath("/dashboard/orders");
  redirect(`/thank-you?orderId=${order.id}`);
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
    const orders = await prisma.order.findMany({
      where: {
        userId: "current-user-id" // This will be replaced with actual user ID from session
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