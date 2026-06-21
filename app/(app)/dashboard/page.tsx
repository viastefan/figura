import Link from 'next/link'
import { Button } from '@/components/ui/button'

const DEMO_SESSIONS = [
  {
    id: 'demo-1',
    title: 'Familie Müller – Systemaufstellung',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'active',
  },
  {
    id: 'demo-2',
    title: 'Coaching: Berufliche Neuorientierung',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'active',
  },
  {
    id: 'demo-3',
    title: 'Paarberatung – Erstgespräch',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'active',
  },
]

function formatRelative(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Gerade eben'
  if (hours < 24) return `Vor ${hours} Std.`
  const days = Math.floor(hours / 24)
  return `Vor ${days} Tag${days > 1 ? 'en' : ''}`
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col px-6 py-8 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1F4045]">
            Meine Sitzungen
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Demo-Modus</p>
        </div>
        <Link href="/session/demo-1">
          <Button className="bg-[#1F4045] hover:bg-[#1F4045]/90 gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Neue Sitzung
          </Button>
        </Link>
      </div>

      {/* Session list */}
      <div className="flex flex-col divide-y border rounded-xl overflow-hidden bg-white shadow-sm">
        {DEMO_SESSIONS.map((session) => (
          <Link
            key={session.id}
            href={`/session/${session.id}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#C9A96E]/20 flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#1F4045" strokeWidth="1.5" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#1F4045" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="font-medium text-[#1F4045] truncate">{session.title}</p>
                <p className="text-xs text-muted-foreground">{formatRelative(session.updated_at)}</p>
              </div>
            </div>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              className="text-muted-foreground group-hover:text-[#1F4045] transition-colors shrink-0"
            >
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Hint */}
      <div className="mt-6 p-4 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/30">
        <p className="text-sm text-[#1F4045]">
          <strong>Demo-Modus:</strong> Alle Sitzungen und Figuren werden lokal im Browser gespeichert.
          Klicke auf eine Sitzung um das Systembrett zu öffnen.
        </p>
      </div>
    </div>
  )
}
