'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialCategory = searchParams.get('category') || 'all'

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicSupabase.from('categories').select('*').then(({ data }) => {
      setCategories(data ?? [])
    })
  }, [])

  useEffect(() => {
  setLoading(true)
  let query = publicSupabase.from('products').select('*, categories(name, slug)').eq('in_stock', true)
  
  if (selectedCategory !== 'all') {
    supabase
      .from('products')
      .select('*, categories!inner(name, slug)')
      .eq('in_stock', true)
      .eq('categories.slug', selectedCategory)
      .then(({ data }) => {
        setProducts(data ?? [])
        setLoading(false)
      })
  } else {
    query.then(({ data }) => {
      setProducts(data ?? [])
      setLoading(false)
    })
  }
}, [selectedCategory])

  return (
    <div className="pb-24 bg-[#FAF5EF] min-h-screen">
      {/* Category tabs */}
      <div className="sticky top-16 z-40 bg-white border-b px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#5C3317] text-white'
                : 'bg-gray-100 text-gray-600'
            }`}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#5C3317] text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-4 pt-4">
        <p className="text-xs text-gray-400 mb-3">{products.length} products</p>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No products in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map((product) => (
              <Link key={product.id} href={`/shop/${product.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name}
                      className="w-full aspect-square object-cover" />
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-4xl">
                      👟
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{product.categories?.name}</p>
                  <p className="text-base font-bold text-[#5C3317] mt-1">৳{product.price}</p>
                  <button className="w-full mt-2 bg-[#5C3317] text-white text-xs py-2 rounded-lg hover:bg-[#C4874A] transition-colors">
                    Order Now
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}