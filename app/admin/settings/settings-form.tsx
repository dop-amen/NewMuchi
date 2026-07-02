'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminSettingsForm({ currentEmail }: { currentEmail: string }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function handleEmailChange() {
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    setMsg(error ? error.message : 'Check your new email inbox to confirm the change.')
  }

  async function handlePasswordChange() {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setMsg(error ? error.message : 'Password updated successfully.')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-sm text-gray-500 mb-2">Current email: {currentEmail}</p>
        
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded-lg p-2 w-full mb-2"
        />
        <button onClick={handlePasswordChange} className="bg-[#5C3317] text-white px-4 py-2 rounded-lg">
          Update Password
        </button>
      </div>

      {msg && <p className="text-sm text-[#5C3317]">{msg}</p>}
    </div>
  )
}