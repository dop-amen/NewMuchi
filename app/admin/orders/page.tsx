import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import Link from 'next/link'
import { UpdateOrderStatus } from '@/components/update-order-status'

export default async function AdminOrdersPage() {
  const sb = await createSupabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await sb.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) redirect('/')

  const { data: orders } = await sb
    .from('orders')
    .select('*, profiles(full_name), order_items(*, products(id, name, image_url)), guest_name, is_guest')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FAF5EF] p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-[#5C3317] hover:underline text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-[#5C3317]">Orders</h1>
      </div>

      <div className="space-y-4">
        {!orders?.length ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400 shadow-sm">No orders yet.</div>
        ) : (
          orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-gray-800">Order #{order.id}</span>
                  <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500">
                    Customer: {order.profiles?.full_name ?? order.guest_name ?? 'Unknown'}
                    {order.is_guest && <span className="ml-1 text-[#C4874A]">(Guest)</span>}
                  </p>
                  <p className="text-xs text-gray-500">📞 {order.phone ?? 'No phone'}</p>
                  <p className="text-xs text-gray-500">📍 {order.address}</p>
                  
                  {/* Delivery Info Display */}
                  <div className="pt-1.5 mt-1 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-0.5 text-xs">
                    <span className="text-gray-600">
                      <span className="font-medium text-gray-400">Zone:</span> {order.delivery_zone ?? 'Inside Dhaka'}
                    </span>
                    <span className="text-gray-600">
                      <span className="font-medium text-gray-400">Delivery:</span> ৳{order.delivery_charge ?? 80}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-[#5C3317]">৳{order.total}</p>
                  <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
                </div>
              </div>
              
              <div className="border-t pt-3 space-y-2">
                {order.order_items?.map((item: any) => (
                  <Link
                    key={item.id}
                    href={`/shop/${item.products?.id}`}
                    target="_blank"
                    className="flex items-center gap-3 hover:bg-[#FAF5EF] rounded-lg p-1 transition-colors"
                  >
                    {item.products?.image_url && (
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <p className="text-sm text-gray-600">
                      {item.products?.name} × {item.quantity} — ৳{item.price * item.quantity}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}