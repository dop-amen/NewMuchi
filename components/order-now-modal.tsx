'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { X, ShoppingBag, Minus, Plus } from 'lucide-react'

interface Props {
  product: any
  selectedSize: string | null
  selectedColor: string | null
  onClose: () => void
}

export function OrderNowModal({ product, selectedSize, selectedColor, onClose }: Props) {
  const router = useRouter()

  // Wallets get a discounted delivery rate, everything else uses the standard rate
  const categoryName = product?.categories?.name?.toLowerCase() || ''
  const isWallet = categoryName.includes('wallet')
  const rates = isWallet
    ? { inside: 60, outside: 100 }
    : { inside: 80, outside: 130 }

  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>('inside')
  const deliveryCharge = deliveryZone === 'inside' ? rates.inside : rates.outside

  // Colors as specified during product upload
  const colors = product.colors
    ? product.colors.split(',').map((c: string) => c.trim()).filter(Boolean)
    : []
  const [colorChoice, setColorChoice] = useState<string | null>(selectedColor ?? null)

  // Sizes as specified during product upload
  const sizes = product.sizes
    ? product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean)
    : []
  const [sizeChoice, setSizeChoice] = useState<string | null>(selectedSize ?? null)

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  // Calculations based strictly on this specific single product bundle
  const itemTotal = product.price * quantity
  const finalTotal = itemTotal + deliveryCharge

  const nameValid = name.trim().length > 0
  const phoneValid = phone.trim().length > 0
  const addressValid = address.trim().length > 0
  const colorValid = colors.length === 0 || !!colorChoice
  const sizeValid = sizes.length === 0 || !!sizeChoice
  const formValid = nameValid && phoneValid && addressValid && colorValid && sizeValid

  async function handleOrder() {
    setTouched(true)

    if (!formValid) {
      setError('Please fill in all fields before placing your order.')
      return
    }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()

    const noteparts = []
    if (sizeChoice) noteparts.push(`Size: ${sizeChoice}`)
    if (colorChoice) noteparts.push(`Color: ${colorChoice}`)
    const addressWithNote = noteparts.length
      ? `${address.trim()}\n[${noteparts.join(', ')}]`
      : address.trim()

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id ?? null,
        total: finalTotal,
        delivery_zone: deliveryZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka',
        delivery_charge: deliveryCharge,
        address: addressWithNote,
        phone: phone.trim(),
        status: 'pending',
        is_guest: !user,
        guest_name: user ? null : name.trim(),
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
      quantity,
      price: product.price,
    })

    router.push('/order-success')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-md bg-white sm:rounded-2xl rounded-t-2xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col transform transition-all border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#995628]" />
            <h2 className="text-lg font-bold text-gray-800">Quick Checkout</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Interactive Counter Area */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</span>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-gray-800">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-50 text-gray-600 active:scale-95 transition-transform"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">Item Unit Price</span>
            <span className="text-gray-500 font-medium text-xs">৳{product.price} each</span>
          </div>
        </div>

        {/* Integrated Order Summary Block */}
        <div className="bg-white rounded-xl p-4 border border-gray-200/80 shadow-sm space-y-3.5 mb-4">
          <div>
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2.5">Order Summary (সারসংক্ষেপ)</h3>
            <div className="flex justify-between items-start py-1">
              <div className="flex gap-3 items-center">
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100" 
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 line-clamp-1">{product.name}</span>
                  {(sizeChoice || colorChoice) && (
                    <div className="flex gap-1.5 text-xs text-gray-500 mt-0.5 font-medium">
                      {sizeChoice && <span>Size: {sizeChoice}</span>}
                      {sizeChoice && colorChoice && <span>•</span>}
                      {colorChoice && <span>Color: {colorChoice}</span>}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap ml-2">
                ৳{product.price} × {quantity}
              </span>
            </div>
          </div>

          {/* Pricing Details Breakdown */}
          <div className="space-y-2 border-t border-gray-100 pt-3 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-800">৳{itemTotal}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex flex-col">
                <span>Delivery Charge</span>
                <span className="text-[11px] text-gray-400 font-normal">
                  ({deliveryZone === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'})
                </span>
              </span>
              <span className="font-semibold text-gray-800">৳{deliveryCharge}</span>
            </div>
          </div>

          {/* Grand Absolute Total */}
          <div className="flex justify-between items-center border-t border-gray-100 pt-3">
            <span className="font-bold text-gray-800 text-sm">Total Amount</span>
            <span className="font-black text-[#995628] text-xl">৳{finalTotal}</span>
          </div>
        </div>

        {/* Size Selector — required if the product has sizes */}
        {sizes.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
              Select Size <span className="normal-case text-gray-400 font-normal">(সাইজ নির্বাচন করুন) *</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size: string) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSizeChoice(size)}
                  className={`min-w-[40px] px-3.5 py-1.5 rounded-lg border-2 text-xs font-semibold transition-colors ${
                    sizeChoice === size
                      ? 'border-[#995628] bg-[#995628] text-white'
                      : 'border-gray-200 text-gray-700 hover:border-[#995628]/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {touched && !sizeValid && <p className="text-red-500 text-xs mt-1.5 ml-1">Please select a size</p>}
          </div>
        )}

        {/* Color Selector — required if the product has colors */}
        {colors.length > 0 && (
          <div className="mb-4">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
              Select Color <span className="normal-case text-gray-400 font-normal">(রঙ নির্বাচন করুন) *</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color: string) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setColorChoice(color)}
                  className={`px-3.5 py-1.5 rounded-lg border-2 text-xs font-semibold transition-colors ${
                    colorChoice === color
                      ? 'border-[#995628] bg-[#995628] text-white'
                      : 'border-gray-200 text-gray-700 hover:border-[#995628]/50'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
            {touched && !colorValid && <p className="text-red-500 text-xs mt-1.5 ml-1">Please select a color</p>}
          </div>
        )}

        {/* Delivery Form inputs */}
        <div className="space-y-3 mb-4">
          <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Shipping Details</h3>
          <div>
            <input
              type="text"
              placeholder="Your name (আপনার নাম) *"
              value={name}
              onChange={e => setName(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#995628] focus:border-transparent transition-all bg-gray-50/30 ${
                touched && !nameValid ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {touched && !nameValid && <p className="text-red-500 text-xs mt-1 ml-1">Name is required</p>}
          </div>
          <div>
            <input
              type="tel"
              placeholder="Phone number (মোবাইল নম্বর) *"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#995628] focus:border-transparent transition-all bg-gray-50/30 ${
                touched && !phoneValid ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {touched && !phoneValid && <p className="text-red-500 text-xs mt-1 ml-1">Phone number is required</p>}
          </div>
          <div>
            <textarea
              placeholder="Full delivery address (পূর্ণ ঠিকানা) *"
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={2}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#995628] focus:border-transparent transition-all bg-gray-50/30 resize-none ${
                touched && !addressValid ? 'border-red-400' : 'border-gray-300'
              }`}
            />
            {touched && !addressValid && <p className="text-red-500 text-xs mt-1 ml-1">Delivery address is required</p>}
          </div>
        </div>

        {/* Delivery Zone Options */}
        <div className="bg-gray-50/50 border border-gray-200 p-3 rounded-xl space-y-2 mb-5">
          <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider">
            Delivery Area <span className="text-gray-400 font-normal normal-case">(ডেলিভারি এলাকা)</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Inside Dhaka */}
            <label className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer select-none transition-all ${
              deliveryZone === 'inside' 
                ? 'border-[#995628] bg-[#FAF5EF]' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="deliveryZoneModal" 
                  checked={deliveryZone === 'inside'}
                  onChange={() => setDeliveryZone('inside')}
                  className="text-[#995628] focus:ring-[#995628] h-4 w-4 border-gray-300"
                />
                <span className="text-xs font-bold text-gray-700">Inside Dhaka</span>
              </div>
              <span className="text-xs font-black text-[#995628]">৳{rates.inside}</span>
            </label>

            {/* Outside Dhaka */}
            <label className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer select-none transition-all ${
              deliveryZone === 'outside' 
                ? 'border-[#995628] bg-[#FAF5EF]' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
              <div className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="deliveryZoneModal" 
                  checked={deliveryZone === 'outside'}
                  onChange={() => setDeliveryZone('outside')}
                  className="text-[#995628] focus:ring-[#995628] h-4 w-4 border-gray-300"
                />
                <span className="text-xs font-bold text-gray-700">Outside Dhaka</span>
              </div>
              <span className="text-xs font-black text-[#995628]">৳{rates.outside}</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleOrder}
          disabled={loading}
          className="w-full bg-[#995628] text-white py-3.5 rounded-xl font-bold hover:bg-[#7d431e] active:scale-[0.99] transition-all shadow-md disabled:opacity-50 disabled:pointer-events-none text-sm uppercase tracking-wider"
        >
          {loading ? 'Placing Order...' : `Confirm Order · ৳${finalTotal}`}
        </button>
      </div>
    </div>
  )
}