'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function EditProductForm({ product, categories }: { product: any, categories: any[] }) {
  const router = useRouter()
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description ?? '')
  const [price, setPrice] = useState(product.price.toString())
  const [categoryId, setCategoryId] = useState(product.category_id?.toString() ?? '')
  const [inStock, setInStock] = useState(product.in_stock)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(product.image_url ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  async function handleSave() {
    setLoading(true)
    setError('')

    let image_url = product.image_url

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, imageFile)
      if (uploadError) {
        setError('Image upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName)
      image_url = urlData.publicUrl
    }

    const { error: updateError } = await supabase.from('products').update({
      name,
      description,
      price: parseFloat(price),
      category_id: categoryId ? parseInt(categoryId) : null,
      image_url,
      in_stock: inStock,
    }).eq('id', product.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      router.push('/admin/products')
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (৳)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C4874A]">
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="inStock" checked={inStock} onChange={e => setInStock(e.target.checked)}
            className="w-4 h-4" />
          <label htmlFor="inStock" className="text-sm font-medium text-gray-700">In Stock</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-3" />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2" />
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