'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { ArrowLeft, Truck, Shield, RotateCcw, Star } from 'lucide-react'
import { FaFacebookMessenger } from 'react-icons/fa'


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
        <span>📏 Size Guide — সাইজ গাইড</span>
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
          <p className="text-xs text-muted-foreground text-center py-2">পা মেপে সঠিক সাইজ নিন</p>
        </div>
      )}
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

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
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">👟</div>
            )}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg">
                -{discount}% OFF
              </span>
            )}
            {product.is_hot_deal && (
              <span className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                🔥 Hot Deal
              </span>
            )}
          </div>

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

            {/* Description */}
            {product.description && (
              <p className="text-foreground/80 leading-relaxed mt-4">{product.description}</p>
            )}

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

            {/* Size Guide */}
            <SizeGuide />

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
    </div>
  )
}