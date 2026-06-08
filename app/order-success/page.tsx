import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <div className="pb-24 bg-[#FAF5EF] min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <span className="text-6xl">✅</span>
      <h1 className="text-2xl font-bold text-[#5C3317] text-center">Order Placed!</h1>
     <p className="text-gray-500 text-center">Your order has been received. We'll contact you shortly to confirm delivery.</p>
<p className="text-[#C4874A] font-medium text-center">Thank you for shopping with Muchi Bari!</p>
      <Link href="/shop"
        className="bg-[#5C3317] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#C4874A] transition-colors">
        Continue Shopping
      </Link>
    </div>
  )
}