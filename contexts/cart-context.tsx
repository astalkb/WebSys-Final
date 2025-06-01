"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction, updateCartItem as updateCartItemAction, getCart, clearCart as clearCartAction } from "@/lib/actions/cart"
import { Cart, CartItem } from "@/lib/types"
import { useRouter } from "next/navigation"

interface CartState {
  items: CartItem[]
  total: number
  isLoading: boolean
}

type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "ADD_ITEM"; payload: { productId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }

const CartContext = createContext<{
  state: CartState
  addItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  items: CartItem[]
  total: number
  isLoading: boolean
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total,
        isLoading: false,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    case "CLEAR_CART":
      return { items: [], total: 0, isLoading: false }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, isLoading: true })
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function loadCart() {
      try {
        const cart = await getCart()
        if (cart) {
          dispatch({ type: "SET_CART", payload: cart })
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        toast({
          title: "Error",
          description: "Failed to load cart. Please try again.",
          variant: "destructive",
        })
      }
    }
    loadCart()
  }, [toast])

  const addItem = async (productId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      
      try {
        await addToCartAction(productId, quantity)
        const cart = await getCart()
        if (cart) {
          dispatch({ type: "SET_CART", payload: cart })
          toast({
            title: "Added to cart",
            description: "Item has been added to your cart.",
          })
        }
      } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
          toast({
            title: "Login required",
            description: "Please log in to add items to your cart.",
            variant: "destructive",
          })
          router.push('/login')
          return
        }
        throw error
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      await removeFromCartAction(itemId)
      
      const cart = await getCart()
      if (cart) {
        dispatch({ type: "SET_CART", payload: cart })
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart.",
        })
      }
    } catch (error) {
      console.error("Error removing from cart:", error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      await updateCartItemAction(itemId, quantity)
      
      const cart = await getCart()
      if (cart) {
        dispatch({ type: "SET_CART", payload: cart })
      }
    } catch (error) {
      console.error("Error updating cart item:", error)
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      await clearCartAction()
      dispatch({ type: "CLEAR_CART" })
    } catch (error) {
      console.error("Error clearing cart:", error)
      toast({
        title: "Error",
        description: "Failed to clear cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        items: state.items,
        total: state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        isLoading: state.isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
