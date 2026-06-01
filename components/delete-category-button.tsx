'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function DeleteCategoryButton({ id }: { id: number }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this category?')) return
    await supabase.from('categories').delete().eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-sm">
      Delete
    </button>
  )
}