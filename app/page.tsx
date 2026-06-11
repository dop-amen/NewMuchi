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

export default async function HomePage() {
  const supabase = await createSupabaseServer()

  // 1. Fetch the banner using a clean response wrapper to avoid TypeScript naming conflicts
  const bannerResponse = await supabase
    .from('hero_banner')
    .select('mobile_image_url, desktop_image_url')
    .eq('id', 1)
    .maybeSingle()

  // 2. This safely prints the result to your terminal window running "npm run dev"
  console.log('--- SUPABASE DEBUG START ---')
  console.log('BANNER DATA:', bannerResponse.data)
  console.log('BANNER ERROR:', bannerResponse.error)
  console.log('--- SUPABASE DEBUG END ---')

  // 3. Assign the data to bannerData so the rest of your original code keeps working
  const bannerData = bannerResponse.data
  
  // Unused variable clean up to prevent any further warnings
  const bannerUrl = bannerData?.mobile_image_url ?? bannerData?.desktop_image_url ?? null

  // 4. Fetch your categories
  const { data: categories } = await supabase.from('categories').select('*')

  // 5. Fetch Hot deals
  const { data: hotDeals } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('is_hot_deal', true)
    .eq('in_stock', true)
    .limit(10)
  // Per-category products (first 4 categories)
  const topCategories = (categories ?? []).slice(0, 4)
  const categoryProducts: Record<number, any[]> = {}
  await Promise.all(
    topCategories.map(async (cat) => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', cat.id)
        .eq('in_stock', true)
        .limit(6)
      categoryProducts[cat.id] = data ?? []
    })
  )

  return (
    <div className="pb-20 bg-[#FAF5EF]">

      {/* Search Bar */}
      <Link href="/shop" className="sticky top-16 z-40 bg-white px-4 py-3 shadow-sm block">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm text-gray-400">Search products...</span>
        </div>
      </Link>


{/* Hero Banner */}
{bannerData?.mobile_image_url || bannerData?.desktop_image_url ? (
  <>
    {bannerData.mobile_image_url && (
      <Link href="/shop" className="mx-4 mt-4 rounded-2xl overflow-hidden md:hidden block">
        <img src={bannerData.mobile_image_url} alt="Banner" className="w-full object-cover" />
      </Link>
    )}
    {bannerData.desktop_image_url && (
      <Link href="/shop" className="mx-4 mt-4 rounded-2xl overflow-hidden hidden md:block">
        <img src={bannerData.desktop_image_url} alt="Banner" className="w-full object-cover" />
      </Link>
    )}
  </>
) : (
  <div className="mx-4 mt-4 rounded-2xl overflow-hidden bg-gradient-to-r from-[#5C3317] to-[#C4874A] p-6 flex items-center justify-between min-h-[140px]">
    <div>
      <p className="text-white/80 text-sm">Best Choice</p>
      <h2 className="text-white font-bold text-2xl leading-tight">Premium<br />Leather Goods</h2>
      <div className="mt-2 bg-white/20 rounded-lg px-3 py-1 inline-block">
        <span className="text-white font-bold text-lg">Up to 50% OFF</span>
      </div>
      <div className="mt-3">
        <Link href="/shop" className="bg-white text-[#5C3317] text-sm font-semibold px-4 py-2 rounded-lg inline-block">
          Shop Now
        </Link>
      </div>
    </div>
    <div className="text-6xl">🥿</div>
  </div>
)}

      {/* Category Slider */}
      <div className="mt-6 px-4">
        <h3 className="font-bold text-base text-[#5C3317] mb-3">Categories</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {(categories ?? []).map((cat) => (
            <Link key={cat.slug}
  href={`/shop?category=${cat.slug}`}
  className="flex-shrink-0 flex flex-col items-center gap-2 bg-white rounded-xl p-3 shadow-sm w-24 hover:shadow-md transition-shadow">
  {cat.image_url ? (
    <img src={cat.image_url} alt={cat.name} className="w-12 h-12 object-cover rounded-lg" />
  ) : (
    <span className="text-3xl">{categoryEmojis[cat.slug] ?? '👟'}</span>
  )}
  <span className="text-xs text-center text-gray-700 font-medium leading-tight">{cat.name}</span>
</Link>
          ))}
        </div>
      </div>

      {/* Hot Deals Slider */}
      {(hotDeals ?? []).length > 0 && (
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base text-[#5C3317]">🔥 Hot Deals</h3>
            <Link href="/shop" className="text-xs text-[#C4874A] font-medium flex items-center gap-1">
              View More <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {(hotDeals ?? []).map((product) => {
              const discount = product.original_price && product.original_price > product.price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : null
              return (
                <Link key={product.id} href={`/shop/${product.id}`}
                  className="flex-shrink-0 w-40 bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="relative">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-36 object-cover" />
                    ) : (
                      <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-4xl">👟</div>
                    )}
                    {discount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-sm font-bold text-[#5C3317]">৳{product.price}</p>
                      {product.original_price && (
                        <p className="text-xs text-gray-400 line-through">৳{product.original_price}</p>
                      )}
                    </div>
                    <div className="w-full mt-2 bg-[#5C3317] text-white text-xs py-1.5 rounded-lg text-center">
                      Order Now
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Per-Category Rows */}
      {topCategories.map((cat) => {
        const products = categoryProducts[cat.id] ?? []
        if (products.length === 0) return null
        return (
          <div key={cat.slug} className="mt-6 px-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-[#5C3317]">{cat.name}</h3>
              <Link href={`/shop?category=${cat.slug}`}
                className="text-xs border border-[#5C3317] text-[#5C3317] px-3 py-1 rounded-lg font-medium">
                View More
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {products.map((product) => (
                <Link key={product.id} href={`/shop/${product.id}`}
                  className="flex-shrink-0 w-40 bg-white rounded-xl overflow-hidden shadow-sm">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-36 object-cover" />
                  ) : (
                    <div className="w-full h-36 bg-gray-100 flex items-center justify-center text-4xl">👟</div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                    <p className="text-sm font-bold text-[#5C3317] mt-1">৳{product.price}</p>
                    <div className="w-full mt-2 bg-[#5C3317] text-white text-xs py-1.5 rounded-lg text-center">
                      Order Now
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })}

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