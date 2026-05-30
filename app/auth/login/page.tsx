'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

async function handleLogin() {
  setLoading(true)
  setError('')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    setError(error.message)
    setLoading(false)
  } else {
    await supabase.auth.setSession({
      access_token: data.session!.access_token,
      refresh_token: data.session!.refresh_token,
    })
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', data.user!.id)
      .single()
    console.log('profileData:', profileData, 'profileError:', profileError)
    router.push(profileData?.is_admin ? '/admin' : '/')
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#5C3317] mb-6">Login</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#5C3317] text-white py-2 rounded-lg hover:bg-[#C4874A] transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-sm mt-4 text-gray-500">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-[#C4874A] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}