"use client"

import { useStore, type CartItem as CartItemType } from "@/context/store-context"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export default function Cart() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, currency } = useStore()

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const currencySymbol = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  }[currency]

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">Your Cart ({totalItems})</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <Button onClick={() => setCartOpen(false)}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        removeFromCart={removeFromCart}
                        updateQuantity={updateQuantity}
                        currencySymbol={currencySymbol}
                      />
                    ))}
                  </ul>
                </div>

                <div className="p-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-medium">
                      {currencySymbol}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>
                  <Button className="w-full">Checkout</Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function CartItem({
  item,
  removeFromCart,
  updateQuantity,
  currencySymbol,
}: {
  item: CartItemType
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  currencySymbol: string
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{item.name}</h4>
        <div className="flex items-center mt-1">
          <span className="text-sm font-medium">
            {currencySymbol}
            {item.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center mt-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </button>

          <span className="mx-2 text-sm w-6 text-center">{item.quantity}</span>

          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      <button
        onClick={() => removeFromCart(item.id)}
        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="Remove item"
      >
        <X className="h-4 w-4" />
      </button>
    </li>
  )
}

