'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function EditProductForm({ product, categories }: { product: any, categories: any[] }) {
  const router = useRouter()
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description ?? '')
  const [price, setPrice] = useState(product.price.toString())
  const [originalPrice, setOriginalPrice] = useState(product.original_price?.toString() ?? '')
  const [categoryId, setCategoryId] = useState(product.category_id?.toString() ?? '')
  const [inStock, setInStock] = useState(product.in_stock)
  const [isHotDeal, setIsHotDeal] = useState(product.is_hot_deal ?? false)
  const [sizes, setSizes] = useState(product.sizes ?? '')
  const [colors, setColors] = useState(product.colors ?? '')

  // existing saved URLs — main + extras
  const [mainImageUrl, setMainImageUrl] = useState<string>(product.image_url ?? '')
  const [extraImageUrls, setExtraImageUrls] = useState<string[]>(product.image_urls ?? [])

  // new files to upload
  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const discount = originalPrice && price
    ? Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100)
    : 0

  const totalImageCount = (mainImageUrl ? 1 : 0) + extraImageUrls.length + newImageFiles.length

  function handleNewImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const allowed = 5 - totalImageCount
    if (allowed <= 0) return
    const files = Array.from(e.target.files ?? []).slice(0, allowed)
    setNewImageFiles(prev => [...prev, ...files])
    setNewImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removeNewImage(index: number) {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  function removeExtraUrl(index: number) {
    setExtraImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  function removeMainImage() {
    // promote first extra to main, or clear
    if (extraImageUrls.length > 0) {
      setMainImageUrl(extraImageUrls[0])
      setExtraImageUrls(prev => prev.slice(1))
    } else {
      setMainImageUrl('')
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('products').upload(fileName, file)
    if (error) throw new Error(error.message)
    return supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl
  }

  async function handleSave() {
    setLoading(true)
    setError('')

    try {
      const uploadedUrls = await Promise.all(newImageFiles.map(uploadImage))

      // if main was removed, first new upload becomes main
      let finalMain = mainImageUrl
      let finalExtras = [...extraImageUrls]

      if (!finalMain && uploadedUrls.length > 0) {
        finalMain = uploadedUrls[0]
        finalExtras = [...finalExtras, ...uploadedUrls.slice(1)]
      } else {
        finalExtras = [...finalExtras, ...uploadedUrls]
      }

      const { error: updateError } = await supabase.from('products').update({
        name,
        description,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        category_id: categoryId ? parseInt(categoryId) : null,
        image_url: finalMain,
        image_urls: finalExtras,
        in_stock: inStock,
        is_hot_deal: isHotDeal,
        sizes: sizes.trim() || null,
        colors: colors.trim() || null,
      }).eq('id', product.id)

      if (updateError) throw new Error(updateError.message)
      router.push('/admin/products')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', product.id)
    router.push('/admin/products')
  }

  return (
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

        <div className="flex items-center gap-3">
          <input type="checkbox" id="inStock" checked={inStock} onChange={e => setInStock(e.target.checked)}
            className="w-4 h-4" />
          <label htmlFor="inStock" className="text-sm font-medium text-gray-700">In Stock</label>
        </div>

        <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-700">🔥 Hot Deal</p>
            <p className="text-xs text-gray-400 mt-0.5">Show in the Hot Deals slider on homepage</p>
          </div>
          <button type="button" onClick={() => setIsHotDeal(!isHotDeal)}
            style={{
              width: 48, height: 26, borderRadius: 999,
              backgroundColor: isHotDeal ? '#f97316' : '#d1d5db',
              position: 'relative', border: 'none', cursor: 'pointer',
              transition: 'background-color 0.2s', flexShrink: 0,
            }}>
            <span style={{
              position: 'absolute', top: 3,
              left: isHotDeal ? 25 : 3,
              width: 20, height: 20, borderRadius: '50%',
              backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'left 0.2s', display: 'block',
            }} />
          </button>
        </div>

        {/* Images section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
            <span className="text-gray-400 font-normal ml-1">({totalImageCount}/5)</span>
          </label>

          {/* Existing saved images */}
          {(mainImageUrl || extraImageUrls.length > 0) && (
            <div className="flex flex-wrap gap-3 mb-3">
              {mainImageUrl && (
                <div className="relative">
                  <img src={mainImageUrl} alt="Main"
                    className="w-24 h-24 object-cover rounded-lg" />
                  <span className="absolute top-1 left-1 bg-[#5C3317] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                    Main
                  </span>
                  <button type="button" onClick={removeMainImage}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                    ×
                  </button>
                </div>
              )}
              {extraImageUrls.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt={`Extra ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeExtraUrl(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New image previews (not yet saved) */}
          {newImagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {newImagePreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt={`New ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-lg opacity-80 border-2 border-dashed border-[#C4874A]" />
                  <span className="absolute top-1 left-1 bg-[#C4874A] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                    New
                  </span>
                  <button type="button" onClick={() => removeNewImage(i)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {totalImageCount < 5 && (
            <input type="file" accept="image/*" multiple onChange={handleNewImagesChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2" />
          )}
          {totalImageCount >= 5 && (
            <p className="text-xs text-gray-400">Maximum 5 images reached. Remove one to add another.</p>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={loading}
            className="flex-1 bg-[#5C3317] text-white py-3 rounded-lg font-semibold hover:bg-[#C4874A] transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={handleDelete}
            className="px-6 py-3 border border-red-300 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}