'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    // Demo: simulate sending magic link, then redirect
    await new Promise((r) => setTimeout(r, 800))
    setSent(true)
    setLoading(false)
    // Auto-redirect to dashboard after 1.5s for demo
    setTimeout(() => router.push('/dashboard'), 1500)
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1F4045]">
            Figura
          </h1>
        </Link>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-[#C9A96E]/20 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="#1F4045" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[#1F4045]">Demo-Modus aktiv</p>
              <p className="text-sm text-muted-foreground mt-1">
                Du wirst gleich weitergeleitet…
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@praxis.de"
                required
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1F4045] hover:bg-[#1F4045]/90"
              disabled={loading}
            >
              {loading ? 'Wird gesendet…' : 'Magic Link senden'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Demo-Modus: Kein echter Login erforderlich.
            </p>
          </form>
        )}

        <div className="mt-8 pt-6 border-t flex justify-center gap-6 text-xs text-muted-foreground">
          <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
          <Link href="/impressum" className="hover:underline">Impressum</Link>
        </div>
      </div>
    </div>
  )
}
