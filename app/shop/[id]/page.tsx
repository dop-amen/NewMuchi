import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getWhatsAppLink } from '@/lib/data'
import { AddToCartButton } from '@/components/add-to-cart-button'


const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: product } = await db
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="pb-24 bg-[#FAF5EF] min-h-screen">
      <div className="px-4 pt-4">
        <Link href="/shop" className="text-sm text-[#5C3317] hover:underline">← Back to Shop</Link>
      </div>

      <div className="mt-3 mx-4 rounded-2xl overflow-hidden bg-white">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name}
            className="w-full aspect-square object-cover" />
        ) : (
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-6xl">👟</div>
        )}
      </div>

      <div className="mx-4 mt-4 bg-white rounded-2xl p-5">
        <p className="text-xs text-[#C4874A] font-medium">{product.categories?.name}</p>
        <h1 className="text-xl font-bold text-gray-800 mt-1">{product.name}</h1>
        <p className="text-2xl font-bold text-[#5C3317] mt-2">৳{product.price}</p>
        {product.description && (
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">{product.description}</p>
        )}
        <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
          product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {product.in_stock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="mx-4 mt-4 space-y-3">
        <a href={getWhatsAppLink(`Hi, I want to order: ${product.name} (৳${product.price})`)}
          target="_blank"
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-4 rounded-xl font-semibold text-base">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Order via WhatsApp
        </a>
        
        <AddToCartButton product={product} />
      </div>
    </div>
  )
}