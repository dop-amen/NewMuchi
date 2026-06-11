import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { DeleteCategoryButton } from '@/components/delete-category-button'
import { AddCategoryForm } from '@/components/add-category-form'
import { EditCategoryImageButton } from '@/components/edit-category-image-button'

export default async function AdminCategoriesPage() {
  const sb = await createSupabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await sb.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/')

  const { data: categories } = await supabase.from('categories').select('*')

  return (
    <div className="min-h-screen bg-[#FAF5EF] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-[#5C3317] hover:underline text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-[#5C3317]">Categories</h1>
      </div>

      <AddCategoryForm />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
        <table className="w-full text-sm">
          <thead className="bg-[#FAF5EF] border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-[#5C3317]">Image</th>
              <th className="text-left p-4 font-semibold text-[#5C3317]">Name</th>
              <th className="text-left p-4 font-semibold text-[#5C3317]">Slug</th>
              <th className="text-left p-4 font-semibold text-[#5C3317]">Actions</th>
            </tr>
          </thead>
          <tbody>
  {(categories ?? []).map((cat: any) => (
    <tr key={cat.id} className="border-b hover:bg-[#FAF5EF]/50">
      {/* Column 1: Image Button (Matches "Image" th) */}
      <td className="p-4 w-48">
        <EditCategoryImageButton categoryId={cat.id} currentImageUrl={cat.image_url} />
      </td>
      
      {/* Column 2: Name (Matches "Name" th) */}
      <td className="p-4 font-medium text-gray-800">{cat.name}</td>
      
      {/* Column 3: Slug (Matches "Slug" th) */}
      <td className="p-4 text-gray-500">{cat.slug}</td>
      
      {/* Column 4: Delete Button (Matches "Actions" th) */}
      <td className="p-4">
        <DeleteCategoryButton id={cat.id} />
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  )
}