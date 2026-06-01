'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function ToggleReviewApproval({ id, approved }: { id: number, approved: boolean }) {
  const router = useRouter()

  async function handleToggle() {
    await supabase.from('reviews').update({ approved: !approved }).eq('id', id)
    router.refresh()
  }

  return (
    <button onClick={handleToggle}
      className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
        approved
          ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
          : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'
      }`}>
      {approved ? 'Approved' : 'Approve'}
    </button>
  )
}