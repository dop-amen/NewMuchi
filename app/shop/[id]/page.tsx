'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ArrowLeft, Truck, Shield, RotateCcw, Star, ShoppingBag, CheckCircle2, AlertTriangle, ShieldCheck, XCircle } from 'lucide-react'
import { FaFacebookMessenger } from 'react-icons/fa'
import { OrderNowModal } from '@/components/order-now-modal'


function ProductGallery({ images, name, discount, isHotDeal }: {
  images: string[]
  name: string
  discount: number
  isHotDeal: boolean
}) {
  const [selected, setSelected] = useState(0)
  const touchStartX = useRef<number | null>(null)

  if (images.length === 0) {
    return (
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted flex items-center justify-center text-6xl">
        👟
      </div>
    )
  }

  function prev() {
    setSelected(i => (i === 0 ? images.length - 1 : i - 1))
  }

  function next() {
    setSelected(i => (i === images.length - 1 ? 0 : i + 1))
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image src={images[selected]} alt={name} fill className="object-cover" priority />

        {/* Arrows — only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    selected === i ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg">
            -{discount}% OFF
          </span>
        )}
        {isHotDeal && (
          <span className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
            🔥 Hot Deal
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                selected === i ? 'border-primary' : 'border-transparent hover:border-primary/40'
              }`}
            >
              <Image src={src} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SizeGuide() {
  const [open, setOpen] = useState(false)

  const sizes = [
    { muchi: '39', uk: '39/5', inches: '9' },
    { muchi: '40', uk: '40/6', inches: '9.15' },
    { muchi: '41', uk: '41/7', inches: '9.30' },
    { muchi: '42', uk: '42/8', inches: '9.45' },
    { muchi: '43', uk: '43/9', inches: '10–10.15' },
    { muchi: '44', uk: '44/10', inches: '10.15–10.30' },
  ]

  return (
    <div className="mt-4 border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
      >
        <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
          <span>📏 Shoe Size Guide</span>
          <span className="text-sm font-normal text-slate-500">(only for shoes)</span>
        </span>

        <span className="text-muted-foreground text-lg">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="border-t border-border">
          <table className="w-full text-sm text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th className="py-2 px-3">Muchi Bari</th>
                <th className="py-2 px-3">UK Size</th>
                <th className="py-2 px-3">Inches</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((row, i) => (
                <tr key={row.muchi} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/50'}>
                  <td className="py-2 px-3 font-medium">{row.muchi}</td>
                  <td className="py-2 px-3">{row.uk}</td>
                  <td className="py-2 px-3">{row.inches}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground text-center py-2">পায়ের পাতা থেকে গোড়ালি পর্যন্ত মেপে সঠিক সাইজ নিন</p>
        </div>
      )}
    </div>
  )
}


export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [descOpen, setDescOpen] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [showOrderModal, setShowOrderModal] = useState(false)

  // Reviews
  const [reviews, setReviews] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    supabase
      .from('products')
      .select('*, categories(name, id)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setProduct(data)
        setLoading(false)
        if (data?.categories?.id) {
          supabase
            .from('products')
            .select('*')
            .eq('category_id', data.categories.id)
            .neq('id', id)
            .limit(3)
            .then(({ data: related }) => setRelatedProducts(related ?? []))
        }
      })

    supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('product_id', id)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data ?? []))

    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [id])

  async function handleSubmitReview() {
    if (!comment.trim()) { setSubmitError('Please write a comment.'); return }
    setSubmitting(true)
    setSubmitError('')
    const { error } = await supabase.from('reviews').insert({
      user_id: user.id,
      product_id: parseInt(id),
      rating,
      comment: comment.trim(),
      approved: false,
    })
    if (error) { setSubmitError(error.message) }
    else { setSubmitSuccess(true); setComment(''); setRating(5) }
    setSubmitting(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  )
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link href="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    </div>
  )

  const sizes = product.sizes ? product.sizes.split(',').map((s: string) => s.trim()) : []
  const colors = product.colors ? product.colors.split(',').map((c: string) => c.trim()) : []
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const messengerLink = `https://m.me/61577390296585?text=${encodeURIComponent(
    `Hi! I want to order:\n\nProduct: ${product.name}\nPrice: ৳${product.price}\nLink: https://muchibari.netlify.app/shop/${product.id}`
  )}`

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back - Mobile */}
        <Link href="/shop" className="lg:hidden inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          {(() => {
            const allImages = [
              ...(product.image_url ? [product.image_url] : []),
              ...(Array.isArray(product.image_urls) ? product.image_urls : []),
            ]
            return <ProductGallery images={allImages} name={product.name} discount={discount} isHotDeal={product.is_hot_deal} />
          })()}

          {/* Info */}
          <div>
            <p className="text-sm font-medium text-secondary">{product.categories?.name}</p>
            <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mt-1">
              {product.name}
            </h1>

            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5" style={{
                      fill: star <= Math.round(Number(avgRating)) ? '#facc15' : '#e5e7eb',
                      color: star <= Math.round(Number(avgRating)) ? '#facc15' : '#e5e7eb',
                    }} />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">({avgRating}) · {reviews.length} reviews</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mt-6">
              <span className="text-3xl font-bold text-primary">৳{product.price}</span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-muted-foreground line-through">৳{product.original_price}</span>
              )}
            </div>

            {/* Stock */}
            <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
              product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-3">
                  Select Size <span className="text-muted-foreground font-normal">সাইজ নির্বাচন করুন</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size: string) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Guide — Automatically hide for belts and wallets */}
            {(() => {
              const categoryName = product.categories?.name?.toLowerCase() || '';
              const isBeltOrWallet = categoryName.includes('belt') || categoryName.includes('wallet');
              
              return !isBeltOrWallet ? <SizeGuide /> : null;
            })()}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="pt-4">
                <h3 className="font-semibold pb-2">
                  Select Color <span className="text-muted-foreground font-normal">রঙ নির্বাচন করুন</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color: string) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary'
                      }`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-8 space-y-3">
              <button
                onClick={() => setShowOrderModal(true)}
                className="w-full bg-[#995628] text-white py-4 rounded-xl font-semibold text-base hover:bg-[#C4874A] transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Order Now | Cash on Delivery
              </button>
              <a href={messengerLink} target="_blank" rel="noopener noreferrer"
                className="w-full text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center gap-3"
                style={{ backgroundColor: '#0084FF' }}>
                <FaFacebookMessenger size={24} color="white" />
                Order via Messenger
              </a>
              <AddToCartButton product={product} />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs mt-2 text-muted-foreground">সারাদেশে ডেলিভারি</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs mt-2 text-muted-foreground">১০০% আসল লেদার</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs mt-2 text-muted-foreground">সহজ রিটার্ন</p>
              </div>
            </div>

            {/* Description Accordion */}
            {product.description && (
              <div className="mt-6 border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setDescOpen(!descOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                    📝 Product Details <span className="text-sm font-normal text-slate-500">(পণ্য বিবরণী)</span>
                  </span>
                  <span className="text-muted-foreground text-lg">{descOpen ? '−' : '+'}</span>
                </button>
                {descOpen && (
                  <div className="border-t border-border p-4 bg-background">
                    <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Policy Accordion Tab */}
            <div className="w-full border border-border rounded-lg overflow-hidden mt-10">
              {/* Clickable Accordion Header */}
              <button
                type="button"
                onClick={() => setPolicyOpen(!policyOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors text-left"
              >
                <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                  🔄 রিটার্ন, এক্সচেঞ্জ ও ওয়ারেন্টি পলিসি
                </span>
                <span className="text-muted-foreground text-lg">
                  {policyOpen ? '−' : '+'}
                </span>
              </button>

              {/* Hidden Content Box */}
              {policyOpen && (
                <div className="p-6 space-y-6 border-t border-stone-200 max-h-[65vh] overflow-y-auto bg-white">

  {/* RETURN POLICY */}
  <div className="rounded-3xl border-2 border-blue-100 bg-blue-50 p-6 space-y-5">
    <h3 className="flex items-center gap-3 text-xl font-extrabold text-blue-700">
      <RotateCcw className="w-6 h-6" />
      রিটার্ন পলিসি
    </h3>

    <div className="space-y-4 text-sm text-gray-700">
      <div className="flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>পণ্য ডেলিভারির সময় অবশ্যই ডেলিভারি ম্যানের সামনে চেক করে গ্রহণ করতে হবে।</p>
      </div>

      <div className="flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>ড্যামেজ বা ভুল পণ্য পেলে সাথে সাথে আমাদের জানাতে হবে।</p>
      </div>

      <div className="flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p>এই ক্ষেত্রে সম্পূর্ণ দায়ভার কর্তৃপক্ষ বহন করবে এবং প্রয়োজন অনুযায়ী রিপ্লেসমেন্ট বা এক্সচেঞ্জ দেওয়া হবে।</p>
      </div>
    </div>

    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <p className="text-sm font-medium text-amber-800">
        ডেলিভারির সময় চেক না করলে পরবর্তীতে অভিযোগ গ্রহণযোগ্য নাও হতে পারে।
      </p>
    </div>
  </div>

  {/* EXCHANGE POLICY */}
  <div className="rounded-3xl border-2 border-emerald-100 bg-emerald-50 p-6 space-y-5">
    <h3 className="flex items-center gap-3 text-xl font-extrabold text-emerald-700">
      <RotateCcw className="w-6 h-6" />
      এক্সচেঞ্জ পলিসি
    </h3>

    <div className="space-y-4 text-sm text-gray-700">
      <div className="flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p>সাইজ সমস্যা বা পছন্দ না হলে ডেলিভারির ৭ দিনের মধ্যে এক্সচেঞ্জ করা যাবে।</p>
      </div>

      <div className="flex gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <p>রিফান্ড প্রযোজ্য নয়, শুধুমাত্র এক্সচেঞ্জ সুবিধা রয়েছে।</p>
      </div>
    </div>

    <div className="rounded-2xl border-2 border-emerald-200 bg-white p-5">
      <h4 className="font-bold text-emerald-700 mb-4">
        এক্সচেঞ্জের শর্তাবলী:
      </h4>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>পণ্য অবশ্যই অব্যবহৃত (unused) হতে হবে</p>
        </div>

        <div className="flex gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>অরিজিনাল প্যাকেজিং, বক্স ও ট্যাগ অক্ষত থাকতে হবে</p>
        </div>
      </div>
    </div>

    <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 flex gap-3">
      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
      <p className="font-medium text-rose-700">
        ব্যবহৃত বা ড্যামেজড পণ্য এক্সচেঞ্জযোগ্য নয়।
      </p>
    </div>
  </div>

  {/* DELIVERY POLICY */}
  <div className="rounded-3xl border-2 border-purple-100 bg-purple-50 p-6 space-y-5">
    <h3 className="flex items-center gap-3 text-xl font-extrabold text-purple-700">
      <Truck className="w-6 h-6" />
      ডেলিভারি চার্জ পলিসি
    </h3>

    <div className="rounded-2xl border-2 border-emerald-200 bg-white p-5">
      <h4 className="font-bold text-emerald-700 mb-4">
        ✓ কর্তৃপক্ষ বহন করবে
      </h4>

      <ul className="space-y-3 text-sm text-gray-700">
        <li>• সঠিক সাইজ না পাঠানো হলে</li>
        <li>• ভুল প্রোডাক্ট ডেলিভারি হলে</li>
        <li>• কালার, সাইজ বা ড্যামেজ সংক্রান্ত ত্রুটি থাকলে</li>
      </ul>
    </div>

    <div className="rounded-2xl border-2 border-orange-200 bg-white p-5">
      <h4 className="font-bold text-orange-700 mb-4">
        ⚠ কাস্টমার বহন করবে
      </h4>

      <ul className="space-y-3 text-sm text-gray-700">
        <li>• সঠিক সাইজ দেওয়ার পরও ফিট না হলে</li>
        <li>• পণ্য পছন্দ না হলে</li>
        <li>• লোকেশনে না থাকায় পার্সেল ক্যান্সেল হলে</li>
      </ul>
    </div>
  </div>

  {/* WARRANTY */}
  <div className="rounded-3xl border-2 border-amber-100 bg-amber-50 p-6 space-y-5">
    <h3 className="flex items-center gap-3 text-xl font-extrabold text-amber-700">
      <ShieldCheck className="w-6 h-6" />
      ওয়ারেন্টি পলিসি
    </h3>

    <p className="text-sm text-gray-600">
      আমাদের পণ্যের ধরন অনুযায়ী ওয়ারেন্টি সুবিধা প্রদান করা হয়।
    </p>

    <div className="space-y-4">

      <div className="rounded-2xl border-2 border-amber-200 bg-white p-5">
        <h4 className="font-bold text-amber-700 mb-2">
          👡 স্যান্ডেল ও লোফার
        </h4>
        <p className="text-sm text-gray-700">
          ৩ মাসের ফ্রি রিপেয়ার ওয়ারেন্টি
        </p>
      </div>

      <div className="rounded-2xl border-2 border-amber-200 bg-white p-5">
        <h4 className="font-bold text-amber-700 mb-2">
          👞 ক্যাজুয়াল, ফরমাল ও বুট
        </h4>
        <p className="text-sm text-gray-700">
          ৪ মাসের রিপেয়ার ওয়ারেন্টি
        </p>
        <p className="text-sm text-gray-700">
          ৬ মাসের সোল গ্যারান্টি
        </p>
      </div>

      <div className="rounded-2xl border-2 border-amber-200 bg-white p-5">
        <h4 className="font-bold text-amber-700 mb-4">
          ওয়ারেন্টির আওতাভুক্ত:
        </h4>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>সোল ফেটে যাওয়া</p>
          </div>

          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>চামড়া ফেটে যাওয়া</p>
          </div>

          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>সেলাই খুলে যাওয়া</p>
          </div>
        </div>

        <p className="mt-4 border-t pt-4 italic text-gray-500 text-sm">
          এক্ষেত্রে আমরা রিপেয়ার অথবা এক্সচেঞ্জ সার্ভিস প্রদান করবো।
        </p>
      </div>

      <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-4">
        <h4 className="font-bold text-rose-700 mb-2">
          ✕ ওয়ারেন্টির বাইরে
        </h4>

        <p className="text-sm text-gray-700">
          আগুনে পোড়া, অতিরিক্ত পানির কারণে ক্ষতি, বাহ্যিক আঘাতে নষ্ট হওয়া।
        </p>
      </div>
    </div>
  </div>

  {/* FOOTER */}
  <div className="rounded-3xl border-2 border-stone-200 bg-stone-50 p-6 text-center space-y-4">
    <p className="font-semibold text-gray-700">
      যেকোনো সহায়তার জন্য আমাদের সাথে যোগাযোগ করুন
    </p>

    <a 
  href="tel:+8801969592755" 
  className="inline-flex items-center justify-center rounded-2xl bg-[#995628] px-5 py-3 text-white font-bold shadow-md hover:bg-[#C4874A] transition-colors"
>
  📞 হেল্পলাইন: +8801969592755
</a>

    <p className="text-[#995628] font-semibold">
      👉 আপনার সন্তুষ্টিই আমাদের অগ্রাধিকার
    </p>
  </div>

</div>
              )}
            </div>

          </div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-card p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1 mb-3">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className="w-5 h-5" style={{
                        fill: s <= review.rating ? '#facc15' : '#e5e7eb',
                        color: s <= review.rating ? '#facc15' : '#e5e7eb',
                      }} />
                    ))}
                  </div>
                  <p className="text-foreground/80 leading-relaxed mb-4">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{review.profiles?.full_name ?? 'Anonymous'}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Submit Review */}
        <section className="mt-12 max-w-xl">
          <h2 className="font-serif text-2xl font-bold text-foreground mb-6">Leave a Review</h2>
          <div className="bg-card rounded-xl p-6 shadow-sm">
            {!user ? (
              <p className="text-muted-foreground">
                <Link href="/auth/login" className="text-primary font-medium underline">Login</Link> to leave a review.
              </p>
            ) : submitSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                ✓ Review submitted! It will appear after admin approval.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} onClick={() => setRating(s)}>
                      <Star className="w-7 h-7" style={{
                        fill: s <= rating ? '#facc15' : '#e5e7eb',
                        color: s <= rating ? '#facc15' : '#e5e7eb',
                      }} />
                    </button>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Comment</p>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
                    placeholder="Share your experience with this product..."
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-background" />
                </div>
                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                <button onClick={handleSubmitReview} disabled={submitting}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} href={`/shop/${p.id}`}
                  className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">👟</div>
                    )}
                    {p.original_price && p.original_price > p.price && (
                      <span className="absolute top-3 left-3 bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded">
                        -{Math.round(((p.original_price - p.price) / p.original_price) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-primary">৳{p.price}</span>
                      {p.original_price && p.original_price > p.price && (
                        <span className="text-sm text-muted-foreground line-through">৳{p.original_price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      {showOrderModal && (
        <OrderNowModal
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          onClose={() => setShowOrderModal(false)}
        />
      )}
    </div>
  )
}