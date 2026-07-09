'use client'

import { addToCart } from '@/lib/cart'
import { useRouter } from 'next/navigation'
import { FaCartShopping } from "react-icons/fa6";

export function AddToCartButton({ product }: { product: any }) {
  function handleAddToCart() {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url ?? '',
      category: product.categories?.name ?? '',
      sizeOptions: product.sizes ?? undefined,
      colorOptions: product.colors ?? undefined,
    })
    // Show feedback
    alert('Added to cart! Choose size/color from your cart before checkout.')
  }

  return (
    <button
  onClick={handleAddToCart}
  className="flex items-center justify-center gap-3 w-full bg-[#5C3317] text-white py-4 rounded-xl font-semibold text-base hover:bg-[#C4874A] transition-colors">
  <FaCartShopping size={20} />
  Add to Cart
</button>
  )
}