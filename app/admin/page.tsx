import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  return (
    <div className="min-h-screen bg-[#FAF5EF] p-6">
      <h1 className="text-2xl font-bold text-[#5C3317] mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Products', href: '/admin/products', emoji: '👟' },
          { label: 'Categories', href: '/admin/categories', emoji: '📁' },
          { label: 'Orders', href: '/admin/orders', emoji: '📦' },
          { label: 'Reviews', href: '/admin/reviews', emoji: '⭐' },
          { label: 'Banner', href: '/admin/banners', emoji: '🖼️' },
          { label: 'Settings', href: '/admin/settings', emoji: '⚙️' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-4xl">{item.emoji}</span>
            <span className="font-semibold text-[#5C3317]">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}