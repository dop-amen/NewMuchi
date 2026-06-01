'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function AddCategoryForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleAdd() {
    if (!name.trim()) return
    setLoading(true)
    setError('')
    const slug = name.toLowerCase().replace(/ /g, '-')
    const { error } = await supabase.from('categories').insert({ name, slug })
    if (error) {
      setError(error.message)
    } else {
      setName('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-semibold text-gray-700 mb-3">Add New Category</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="flex gap-3">
        <input type="text" placeholder="Category name" value={name}
          onChange={e => setName(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4874A]" />
        <button onClick={handleAdd} disabled={loading}
          className="bg-[#5C3317] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#C4874A] transition-colors disabled:opacity-50">
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
    </div>
  )
}