import { redirect } from 'next/navigation'
import { createSupabaseServer } from '@/lib/supabase-server'
import AdminSettingsForm from './settings-form'
import AddAdminForm from './add-admin-form'

export default async function AdminSettingsPage() {
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
    <div className="min-h-screen bg-[#FAF5EF] p-6 max-w-md">
      <h1 className="text-2xl font-bold text-[#5C3317] mb-6">Account Settings</h1>
      <AdminSettingsForm currentEmail={user.email!} />
      
    </div>
  )
}