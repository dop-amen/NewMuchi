'use client'

import { useState } from 'react'
import { addAdmin } from './add-admin-action'

export default function AddAdminForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setLoading(true)
    const result = await addAdmin(email, password)
    setMsg(result.message)
    setLoading(false)
    if (result.success) {
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="font-semibold text-[#5C3317] mb-2">Add New Admin</h2>
      <input
        type="email"
        placeholder="New admin email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded-lg p-2 w-full mb-2"
      />
      <input
        type="password"
        placeholder="Temporary password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded-lg p-2 w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-[#5C3317] text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Admin'}
      </button>
      {msg && <p className="mt-3 text-sm text-[#5C3317]">{msg}</p>}
    </div>
  )
}