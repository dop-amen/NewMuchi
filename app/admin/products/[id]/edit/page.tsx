import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'
import { EditProductForm } from '@/components/edit-product-form'
import Link from 'next/link'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sb = await createSupabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await sb.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/')

  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  const { data: categories } = await supabase.from('categories').select('*')

  if (!product) redirect('/admin/products')

  return (
    <div className="min-h-screen bg-[#FAF5EF] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-[#5C3317] hover:underline text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-[#5C3317]">Edit Product</h1>
      </div>
      <EditProductForm product={product} categories={categories ?? []} />
    </div>
  )
}