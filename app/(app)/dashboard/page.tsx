import Link from 'next/link'

const DEMO_SESSIONS = [
  { id: 'demo-1', title: 'Familie Müller – Systemaufstellung', updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), figures: 6 },
  { id: 'demo-2', title: 'Coaching: Berufliche Neuorientierung', updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), figures: 4 },
  { id: 'demo-3', title: 'Paarberatung – Erstgespräch', updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), figures: 2 },
]

function formatRelative(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return 'Gerade eben'
  if (hours < 24) return `Vor ${hours} Std.`
  return `Vor ${Math.floor(hours / 24)} Tagen`
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col px-8 py-10 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1F4045]">Sitzungen</h1>
          <p className="text-sm text-[#1F4045]/40 mt-1">Demo-Modus — Daten werden lokal gespeichert</p>
        </div>
        <Link
          href="/session/neue-sitzung"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1F4045] text-white text-sm font-medium hover:bg-[#1F4045]/90 transition-all shadow-md shadow-[#1F4045]/15 hover:-translate-y-0.5"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          Neue Sitzung
        </Link>
      </div>

      {/* Sessions */}
      <div className="flex flex-col gap-3">
        {DEMO_SESSIONS.map((session) => (
          <Link
            key={session.id}
            href={`/session/${session.id}`}
            className="group flex items-center gap-4 p-5 rounded-2xl bg-white/70 hover:bg-white border border-white hover:border-[#C9A96E]/30 transition-all hover:shadow-md hover:shadow-[#1F4045]/5 hover:-translate-y-0.5"
          >
            {/* Board mini preview */}
            <div
              className="w-12 h-12 rounded-xl shrink-0 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #e8d5b0, #d4b87a)' }}
            >
              <div className="absolute inset-0" style={{
                border: '1.5px solid rgba(139,90,43,0.15)',
                borderRadius: '40% 60% 55% 45% / 40% 45% 55% 60%',
                margin: '4px',
              }} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1F4045] group-hover:text-[#1F4045] truncate">{session.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-[#1F4045]/40">{formatRelative(session.updated_at)}</span>
                <span className="text-[#1F4045]/20">·</span>
                <span className="text-xs text-[#1F4045]/40">{session.figures} Figuren</span>
              </div>
            </div>

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1F4045]/20 group-hover:text-[#C9A96E] transition-colors shrink-0">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        ))}
      </div>

      {/* KI hint */}
      <div className="mt-8 p-4 rounded-2xl bg-[#C9A96E]/8 border border-[#C9A96E]/20 flex items-start gap-3">
        <span className="text-lg mt-0.5">✦</span>
        <div>
          <p className="text-sm font-medium text-[#1F4045]">KI-Analyse verfügbar</p>
          <p className="text-xs text-[#1F4045]/60 mt-0.5">
            Im Board kannst du die KI fragen was sie in der Aufstellung sieht — systemische Perspektiven auf Positionen, Blickrichtungen und Verbindungen.
          </p>
        </div>
      </div>
    </div>
  )
}
