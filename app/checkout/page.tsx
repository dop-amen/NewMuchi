'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCart, getCartTotal, clearCart, CartItem } from '@/lib/cart'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside')
const deliveryCharge = deliveryZone === 'inside' ? 80 : 150
const finalTotal = getCartTotal() + deliveryCharge
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  

  useEffect(() => {
    const items = getCart()
    if (items.length === 0) router.push('/cart')
    setCart(items)

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth/login')
    })
  }, [])

  async function handlePlaceOrder() {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const total = getCartTotal()

    const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({ user_id: user.id, total, address, phone, status: 'pending' })
    .select()
    .single()

    if (orderError) {
      setError(orderError.message)
      setLoading(false)
      return
    }

    const orderItems = cart.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }))

    await supabase.from('order_items').insert(orderItems)

    clearCart()
    router.push('/order-success')
  }

  return (
    <div className="pb-24 bg-[#FAF5EF] min-h-screen">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold text-[#5C3317]">Checkout</h1>
      </div>

      {/* Order Summary */}
      <div className="mx-4 mt-3 bg-white rounded-xl p-4 shadow-sm space-y-4">
  <div>
    <h2 className="font-semibold text-gray-700 mb-3">Order Summary</h2>
    {cart.map(item => (
      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
        <span className="text-sm text-gray-700">{item.name} × {item.quantity}</span>
        <span className="text-sm font-semibold text-[#5C3317]">৳{item.price * item.quantity}</span>
      </div>
    ))}
  </div>

  {/* Price Breakdown Breakdown */}
  <div className="space-y-2 border-t pt-3 text-sm text-gray-600">
    <div className="flex justify-between items-center">
      <span>Subtotal</span>
      <span className="font-medium text-gray-800">৳{getCartTotal()}</span>
    </div>
    <div className="flex justify-between items-center">
      <span>Delivery Charge ({deliveryZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
      <span className="font-medium text-gray-800">৳{deliveryCharge}</span>
    </div>
  </div>

  {/* Final Total Amount */}
  <div className="flex justify-between items-center border-t pt-3">
    <span className="font-bold text-gray-800">Total Amount</span>
    <span className="font-bold text-[#5C3317] text-lg">৳{finalTotal}</span>
  </div>
</div>

      {/* Delivery Info */}
      <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-3">Delivery Info</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#C4874A] text-sm"
        />
        <textarea
          placeholder="Delivery address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A] text-sm"
        />
      </div>

      <div className="bg-background border border-border p-4 rounded-xl space-y-3">
  <h3 className="font-semibold text-sm text-foreground">
    Delivery Area <span className="text-muted-foreground font-normal">(ডেলিভারি এলাকা)</span>
  </h3>
  
  <div className="grid grid-cols-2 gap-3">
    {/* Inside Dhaka */}
    <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
      deliveryZone === 'inside' 
        ? 'border-primary bg-primary/5' 
        : 'border-border hover:border-primary/40'
    }`}>
      <div className="flex items-center gap-2">
        <input 
          type="radio" 
          name="deliveryZone" 
          checked={deliveryZone === 'inside'}
          onChange={() => setDeliveryZone('inside')}
          className="text-primary focus:ring-primary h-4 w-4"
        />
        <div className="text-sm">
          <p className="font-medium text-foreground">Inside Dhaka</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-primary">৳80</span>
    </label>

    {/* Outside Dhaka */}
    <label className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
      deliveryZone === 'outside' 
        ? 'border-primary bg-primary/5' 
        : 'border-border hover:border-primary/40'
    }`}>
      <div className="flex items-center gap-2">
        <input 
          type="radio" 
          name="deliveryZone" 
          checked={deliveryZone === 'outside'}
          onChange={() => setDeliveryZone('outside')}
          className="text-primary focus:ring-primary h-4 w-4"
        />
        <div className="text-sm">
          <p className="font-medium text-foreground">Outside Dhaka</p>
        </div>
      </div>
      <span className="text-sm font-semibold text-primary">৳150</span>
    </label>
  </div>
</div>

      <div className="mx-4 mt-4">
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !address || !phone}
          className="w-full bg-[#5C3317] text-white py-4 rounded-xl font-semibold text-base hover:bg-[#C4874A] transition-colors disabled:opacity-50">
          {loading ? 'Placing Order...' : 'Place Order'}
          (৳{finalTotal})
        </button>
      </div>
    </div>
  )
}