import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ToggleReviewApproval } from '@/components/toggle-review-approval'

export default async function AdminReviewsPage() {
  const sb = await createSupabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await sb.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/')

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, profiles(full_name), products(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FAF5EF] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-[#5C3317] hover:underline text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-[#5C3317]">Reviews</h1>
      </div>

      <div className="space-y-4">
        {!reviews?.length ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm">No reviews yet.</div>
        ) : (
          reviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{review.profiles?.full_name ?? 'Anonymous'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Product: {review.products?.name}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <ToggleReviewApproval id={review.id} approved={review.approved} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}