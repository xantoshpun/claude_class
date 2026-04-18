'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Registration failed')
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, redirect: false })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8">
      <h2 className="text-xl font-semibold mb-6">Create your account</h2>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Name</label>
          <input
            type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your name" minLength={2}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Password</label>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters" minLength={8}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </p>
    </div>
  )
}
