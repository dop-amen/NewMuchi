'use server'

import { createClient } from '@supabase/supabase-js'
import { createSupabaseServer } from '@/lib/supabase-server'

export async function addAdmin(email: string, password: string) {
  const signupClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error: signupError } = await signupClient.auth.signUp({
    email,
    password,
  })

  if (signupError || !data.user) {
    return { success: false, message: signupError?.message ?? 'Signup failed' }
  }

  const supabase = await createSupabaseServer()
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ is_admin: true })
    .eq('id', data.user.id)

  if (updateError) {
    return {
      success: false,
      message: `Account created, but couldn't grant admin: ${updateError.message}`,
    }
  }

  return { success: true, message: 'New admin created successfully.' }
}