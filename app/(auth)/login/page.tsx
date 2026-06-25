'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    await new Promise(r => setTimeout(r, 700))
    setSent(true)
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 40, textDecoration: 'none' }}>
          <svg width="28" height="28" viewBox="0 0 68 80" fill="none">
            <circle cx="34" cy="24" r="14" fill="#1F4045"/>
            <path d="M10 62 C10 46 58 46 58 62 L58 74 C58 77 56 79 53 79 L15 79 C12 79 10 77 10 74 Z" fill="#1F4045"/>
          </svg>
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', color: '#1F4045' }}>Figura</span>
        </Link>

        <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: '0 8px 40px rgba(31,64,69,0.08)', border: '1px solid rgba(31,64,69,0.07)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#C9A96E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#1F4045', marginBottom: 6 }}>Demo-Zugang aktiv</p>
              <p style={{ fontSize: 13, color: 'rgba(31,64,69,0.45)' }}>Du wirst weitergeleitet…</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1F4045', marginBottom: 6, letterSpacing: '-0.02em' }}>Anmelden</h1>
              <p style={{ fontSize: 13, color: 'rgba(31,64,69,0.45)', marginBottom: 24, lineHeight: 1.5 }}>
                Im Demo-Modus reicht jede E-Mail-Adresse.
              </p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(31,64,69,0.6)', marginBottom: 6, letterSpacing: '0.02em' }}>
                    E-MAIL
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@praxis.de"
                    required
                    autoFocus
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: 12,
                      border: '1px solid rgba(31,64,69,0.15)',
                      fontSize: 14, color: '#1F4045', outline: 'none',
                      background: '#FAFAF8', transition: 'border-color 0.15s',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    background: email ? '#1F4045' : 'rgba(31,64,69,0.2)',
                    color: 'white', fontSize: 14, fontWeight: 600,
                    border: 'none', cursor: email ? 'pointer' : 'not-allowed',
                    boxShadow: email ? '0 4px 14px rgba(31,64,69,0.2)' : 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {loading ? 'Wird gesendet…' : 'Weiter →'}
                </button>
              </form>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(31,64,69,0.07)', display: 'flex', justifyContent: 'center', gap: 20 }}>
                {[['Datenschutz', '/datenschutz'], ['Impressum', '/impressum']].map(([l, h]) => (
                  <Link key={l} href={h} style={{ fontSize: 12, color: 'rgba(31,64,69,0.35)', textDecoration: 'none' }}>{l}</Link>
                ))}
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'rgba(31,64,69,0.3)' }}>
          DSGVO-konform · Server Frankfurt
        </p>
      </div>
    </div>
  )
}
