'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { X, ShoppingBag } from 'lucide-react'

interface Props {
  product: any
  selectedSize: string | null
  selectedColor: string | null
  onClose: () => void
}

export function OrderNowModal({ product, selectedSize, selectedColor, onClose }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

async function handleOrder() {
  if (!name.trim() || !phone.trim() || !address.trim()) {
    setError('Please fill in all fields.')
    return
  }
  setLoading(true)
  setError('')

  const { data: { user } } = await supabase.auth.getUser()  // add this

  const noteparts = []
  if (selectedSize) noteparts.push(`Size: ${selectedSize}`)
  if (selectedColor) noteparts.push(`Color: ${selectedColor}`)
  const addressWithNote = noteparts.length
    ? `${address}\n[${noteparts.join(', ')}]`
    : address

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id: user?.id ?? null,        // add this
      total: product.price,
      address: addressWithNote,
      phone,
      status: 'pending',
      is_guest: !user,                  // false if logged in
      guest_name: user ? null : name,   // only save guest_name if not logged in
    })
    .select()
    .single()

    if (orderErr) {
      setError(orderErr.message)
      setLoading(false)
      return
    }

    await supabase.from('order_items').insert({
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price: product.price,
    })

    router.push('/order-success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#5C3317]" />
            <h2 className="text-lg font-bold text-[#5C3317]">Quick Order</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product summary */}
        <div className="bg-[#FAF5EF] rounded-xl p-3 mb-5 flex items-center gap-3">
          {product.image_url && (
            <img src={product.image_url} alt={product.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
          )}
          <div>
            <p className="font-semibold text-sm text-gray-800 line-clamp-1">{product.name}</p>
            <p className="text-[#5C3317] font-bold">৳{product.price}</p>
            {(selectedSize || selectedColor) && (
              <p className="text-xs text-gray-500">
                {[selectedSize && `Size: ${selectedSize}`, selectedColor && `Color: ${selectedColor}`]
                  .filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4874A]"
          />
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4874A]"
          />
          <textarea
            placeholder="Delivery address"
            value={address}
            onChange={e => setAddress(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4874A] resize-none"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full mt-4 bg-[#5C3317] text-white py-3.5 rounded-xl font-semibold hover:bg-[#C4874A] transition-colors disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  )
}