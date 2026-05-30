import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'

export default async function AdminProductsPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (!profile?.is_admin) redirect('/')

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: products } = await db.from('products').select('*, categories(name)')

  return (
    <div className="min-h-screen bg-[#FAF5EF] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-[#5C3317] hover:underline text-sm">← Back</Link>
          <h1 className="text-2xl font-bold text-[#5C3317]">Products</h1>
        </div>
        <Link href="/admin/products/new"
          className="bg-[#5C3317] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#C4874A] transition-colors">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {!products?.length ? (
          <p className="p-8 text-center text-gray-400">No products yet. Add your first product!</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#FAF5EF] border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-[#5C3317]">Product</th>
                <th className="text-left p-4 font-semibold text-[#5C3317]">Category</th>
                <th className="text-left p-4 font-semibold text-[#5C3317]">Price</th>
                <th className="text-left p-4 font-semibold text-[#5C3317]">Stock</th>
                <th className="text-left p-4 font-semibold text-[#5C3317]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id} className="border-b hover:bg-[#FAF5EF]/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{product.categories?.name ?? '—'}</td>
                  <td className="p-4 font-medium">৳{product.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link href={`/admin/products/${product.id}/edit`}
                      className="text-[#C4874A] hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}