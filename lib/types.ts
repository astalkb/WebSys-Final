import { Product } from "@prisma/client";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
} 