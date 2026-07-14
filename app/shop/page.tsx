'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const initialSearch = searchParams.get('search') || ''

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      setCategories(data ?? [])
    })
  }, [])

  useEffect(() => {
    setLoading(true)

    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('in_stock', true)

    if (selectedCategory !== 'all') {
      query = supabase
        .from('products')
        .select('*, categories!inner(name, slug)')
        .eq('in_stock', true)
        .eq('categories.slug', selectedCategory)
    }

    if (searchQuery.trim()) {
      query = query.ilike('name', `%${searchQuery.trim()}%`)
    }

    query.then(({ data }) => {
      setProducts(data ?? [])
      setLoading(false)
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="pb-24 bg-[#FAF5EF] min-h-screen">
      {/* Search Bar */}
      <div className="sticky top-16 z-40 bg-white border-b px-4 py-3 space-y-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all' ? 'bg-[#5C3317] text-white' : 'bg-gray-100 text-gray-600'
            }`}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.slug} onClick={() => setSelectedCategory(cat.slug)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.slug ? 'bg-[#5C3317] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        <p className="text-xs text-gray-400 mb-3">{products.length} products</p>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            {searchQuery ? `No results for "${searchQuery}"` : 'No products in this category yet.'}
          </div>
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
      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-4xl">👟</div>
    )}
    {product.original_price && product.original_price > product.price && (
      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
      </span>
    )}
  </div>
<div className="p-3">
  <p className="text-base font-semibold text-gray-800 truncate">{product.name}</p>
  <p className="text-sm text-gray-400 mt-0.5">{product.categories?.name}</p>
  <div className="mt-1">
    {product.original_price && product.original_price > product.price && (
      <div className="flex items-center gap-1.5 mb-0.5">
        <p className="text-sm text-gray-400 line-through">৳{product.original_price}</p>
        <span className="text-sm font-bold text-red-500">
          {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
        </span>
      </div>
    )}
    <p className="text-lg font-bold text-[#5C3317]">৳{product.price}</p>
  </div>
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