import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getWhatsAppLink, WHATSAPP_NUMBER } from '@/lib/data'
import { createSupabaseServer } from '@/lib/supabase-server'

const categoryEmojis: Record<string, string> = {
  'casual-shoes': '👟',
  'oxford-shoes': '👞',
  'loafer-shoes': '🥿',
  'formal-shoes': '👔',
  'boots': '🥾',
  'ladies-shoes': '👠',
  'winter-collection': '❄️',
  'flat-sandals': '🩴',
  'belts': '🪢',
}

const dummyProducts = [
  { id: 1, name: 'Bond Chelsea', price: 2500, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
  { id: 2, name: 'Oxford Wing', price: 3200, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
  { id: 3, name: 'Luxury Slide', price: 1800, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
  { id: 4, name: 'Arca Derby', price: 2800, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop' },
]

export default async function HomePage() {
  const supabase = await createSupabaseServer()
  const { data: categories } = await supabase.from('categories').select('*')
  return (
    <div className="pb-20 bg-[#FAF5EF]">

      {/* Search Bar */}
      <div className="sticky top-16 z-40 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden bg-gradient-to-r from-[#5C3317] to-[#C4874A] p-6 flex items-center justify-between min-h-[140px]">
        <div>
          <p className="text-white/80 text-sm">Best Choice</p>
          <h2 className="text-white font-bold text-2xl leading-tight">Premium<br />Leather Goods</h2>
          <div className="mt-2 bg-white/20 rounded-lg px-3 py-1 inline-block">
            <span className="text-white font-bold text-lg">Up to 50% OFF</span>
          </div>
          <div className="mt-3">
            <Link href="/shop"
              className="bg-white text-[#5C3317] text-sm font-semibold px-4 py-2 rounded-lg inline-block">
              Shop Now
            </Link>
          </div>
        </div>
        <div className="text-6xl">🥿</div>
      </div>
      {/* Category Slider */}
      <div className="mt-6 px-4">
        <h3 className="font-bold text-base text-[#5C3317] mb-3">Categories</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
         {(categories ?? []).map((cat) => (
  <Link key={cat.slug}
    href={`/shop?category=${cat.slug}`}
    className="flex-shrink-0 flex flex-col items-center gap-2 bg-white rounded-xl p-3 shadow-sm w-24 hover:shadow-md transition-shadow">
    <span className="text-3xl">{categoryEmojis[cat.slug] ?? '👟'}</span>
    <span className="text-xs text-center text-gray-700 font-medium leading-tight">{cat.name}</span>
  </Link>
))}
        </div>
      </div>

      {/* Hot Deals Slider */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-[#5C3317]">🔥 Hot Deals</h3>
          <Link href="/shop" className="text-xs text-[#C4874A] font-medium flex items-center gap-1">
            View More <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
          {dummyProducts.map((product) => (
            <div key={product.id}
              className="flex-shrink-0 w-40 bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-36 object-cover" />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  50% OFF
                </span>
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                <p className="text-sm font-bold text-[#5C3317] mt-1">৳{product.price}</p>
                <button className="w-full mt-2 bg-[#5C3317] text-white text-xs py-1.5 rounded-lg">
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Category Rows */}
      {(categories ?? []).slice(0, 4).map((cat) => (
        <div key={cat.slug} className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-[#5C3317]">{cat.name}</h3>
            <Link href={`/shop?category=${cat.slug}`}
              className="text-xs border border-[#5C3317] text-[#5C3317] px-3 py-1 rounded-lg font-medium">
              View More
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible">
            {dummyProducts.map((product) => (
              <div key={product.id}
                className="flex-shrink-0 w-40 bg-white rounded-xl overflow-hidden shadow-sm">
                <img src={product.image} alt={product.name} className="w-full h-36 object-cover" />
                <div className="p-2">
                  <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                  <p className="text-sm font-bold text-[#5C3317] mt-1">৳{product.price}</p>
                  <button className="w-full mt-2 bg-[#5C3317] text-white text-xs py-1.5 rounded-lg">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* WhatsApp CTA */}
      <div className="mx-4 mt-8 bg-[#25D366] rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-bold text-base">Order via WhatsApp</p>
          <p className="text-white/80 text-sm mt-1">{WHATSAPP_NUMBER}</p>
        </div>
        <a href={getWhatsAppLink('Hi, I want to place an order')} target="_blank"
          className="bg-white text-[#25D366] font-bold text-sm px-4 py-2 rounded-lg">
          Chat Now
        </a>
      </div>

    </div>
  )
}