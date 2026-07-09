'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCart, removeFromCart, updateQuantity, setCartItemVariant, isCartVariantComplete, CartItem } from '@/lib/cart'
import { supabase } from '@/lib/supabase'

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [showVariantError, setShowVariantError] = useState(false)

  useEffect(() => {
    setCart(getCart())
  }, [])

  function handleRemove(id: number) {
    removeFromCart(id)
    setCart(getCart())
  }

  function handleQuantity(id: number, quantity: number) {
    if (quantity < 1) return
    updateQuantity(id, quantity)
    setCart(getCart())
  }

  function handleVariantSelect(id: number, updates: { size?: string; color?: string }) {
    setCartItemVariant(id, updates)
    setCart(getCart())
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const variantsComplete = isCartVariantComplete(cart)

  async function handleCheckout() {
    if (!variantsComplete) {
      setShowVariantError(true)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }
    router.push('/checkout')
  }

  if (cart.length === 0) {
    return (
      <div className="pb-24 bg-[#FAF5EF] min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">🛒</span>
        <p className="text-gray-500 font-medium">Your cart is empty</p>
        <Link href="/shop" className="bg-[#5C3317] text-white px-6 py-3 rounded-xl font-semibold">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-24 bg-[#FAF5EF] min-h-screen">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-[#5C3317]">My Cart</h1>
      </div>

      <div className="px-4 space-y-3 mt-2">
        {cart.map((item) => {
          const sizeOptions = item.sizeOptions
            ? item.sizeOptions.split(',').map(s => s.trim()).filter(Boolean)
            : []
          const colorOptions = item.colorOptions
            ? item.colorOptions.split(',').map(c => c.trim()).filter(Boolean)
            : []
          const sizeMissing = sizeOptions.length > 0 && !item.size
          const colorMissing = colorOptions.length > 0 && !item.color

          return (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex gap-3 items-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">👟</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-[#5C3317] font-bold">৳{item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => handleQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold">−</button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold">+</button>
                  </div>
                </div>
                <button onClick={() => handleRemove(item.id)}
                  className="text-red-400 hover:text-red-600 text-xl flex-shrink-0">✕</button>
              </div>

              {/* Size picker */}
              {sizeOptions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Size {sizeMissing && <span className="text-red-500 normal-case font-normal">— please select</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map(size => (
                      <button
                        key={size}
                        onClick={() => handleVariantSelect(item.id, { size })}
                        className={`min-w-[36px] px-3 py-1 rounded-lg border-2 text-xs font-semibold transition-colors ${
                          item.size === size
                            ? 'border-[#5C3317] bg-[#5C3317] text-white'
                            : 'border-gray-200 text-gray-700 hover:border-[#5C3317]/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color picker */}
              {colorOptions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Color {colorMissing && <span className="text-red-500 normal-case font-normal">— please select</span>}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => handleVariantSelect(item.id, { color })}
                        className={`px-3 py-1 rounded-lg border-2 text-xs font-semibold transition-colors ${
                          item.color === color
                            ? 'border-[#5C3317] bg-[#5C3317] text-white'
                            : 'border-gray-200 text-gray-700 hover:border-[#5C3317]/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Total + Checkout */}
      <div className="mx-4 mt-6 bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-700">Total</span>
          <span className="text-xl font-bold text-[#5C3317]">৳{cartTotal}</span>
        </div>
        {showVariantError && !variantsComplete && (
          <p className="text-red-500 text-sm mb-3 text-center">
            Please select size/color for all items before checkout.
          </p>
        )}
        <button onClick={handleCheckout} disabled={loading}
          className="w-full bg-[#5C3317] text-white py-4 rounded-xl font-semibold text-base hover:bg-[#C4874A] transition-colors disabled:opacity-50">
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}