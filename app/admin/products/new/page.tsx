'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function NewProductPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [originalPrice, setOriginalPrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [sizes, setSizes] = useState('')
  const [colors, setColors] = useState('')
  const [isHotDeal, setIsHotDeal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => setCategories(data ?? []))
  }, [])

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 5)
    setImageFiles(files)
    setImagePreviews(files.map(f => URL.createObjectURL(f)))
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('products').upload(fileName, file)
    if (error) throw new Error(error.message)
    return supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    try {
      const urls = await Promise.all(imageFiles.map(uploadImage))
      const image_url = urls[0] ?? ''
      const image_urls = urls.slice(1)

      const { error: insertError } = await supabase.from('products').insert({
        name,
        description,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        category_id: categoryId ? parseInt(categoryId) : null,
        image_url,
        image_urls,
        in_stock: true,
        sizes: sizes.trim() || null,
        colors: colors.trim() || null,
        is_hot_deal: isHotDeal,
      })

      if (insertError) throw new Error(insertError.message)
      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const discount = originalPrice && price
    ? Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#FAF5EF] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-[#5C3317] hover:underline text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-[#5C3317]">Add Product</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳) *</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price (৳) <span className="text-gray-400 font-normal">optional</span>
              </label>
              <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)}
                placeholder="e.g. 3500"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]" />
            </div>
          </div>

          {discount > 0 && (
            <p className="text-sm text-green-600 font-medium">
              ✓ This product will show a <span className="font-bold">{discount}% OFF</span> tag
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]">
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sizes <span className="text-gray-400 font-normal">optional — comma separated</span>
            </label>
            <input type="text" value={sizes} onChange={e => setSizes(e.target.value)}
              placeholder="e.g. 39,40,41,42,43"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colors <span className="text-gray-400 font-normal">optional — comma separated</span>
            </label>
            <input type="text" value={colors} onChange={e => setColors(e.target.value)}
              placeholder="e.g. Black,Brown,Tan"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]" />
          </div>

          <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-700">🔥 Hot Deal</p>
              <p className="text-xs text-gray-400 mt-0.5">Show this product in the Hot Deals slider on homepage</p>
            </div>
            <button type="button" onClick={() => setIsHotDeal(!isHotDeal)}
              className={`relative w-12 h-6 rounded-full transition-colors ${isHotDeal ? 'bg-orange-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isHotDeal ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Multi-image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images <span className="text-gray-400 font-normal">up to 5 — first image is the main one</span>
            </label>
            <input type="file" accept="image/*" multiple onChange={handleImagesChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt={`Preview ${i + 1}`}
                      className="w-24 h-24 object-cover rounded-lg" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[#5C3317] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                        Main
                      </span>
                    )}
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleSubmit} disabled={loading || !name || !price}
            className="w-full bg-[#5C3317] text-white py-3 rounded-lg font-semibold hover:bg-[#C4874A] transition-colors disabled:opacity-50">
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}