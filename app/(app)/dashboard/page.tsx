'use client'

import { useState } from 'react'
import Link from 'next/link'

const DEMO_SESSIONS = [
  {
    id: 'demo-1',
    title: 'Familie Müller – Systemaufstellung',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    figures: 6,
    snapshots: 3,
    tag: 'Familie',
  },
  {
    id: 'demo-2',
    title: 'Coaching: Berufliche Neuorientierung',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    figures: 4,
    snapshots: 1,
    tag: 'Coaching',
  },
  {
    id: 'demo-3',
    title: 'Paarberatung – Erstgespräch',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    figures: 2,
    snapshots: 0,
    tag: 'Paar',
  },
]

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `Vor ${m} Min.`
  const h = Math.floor(m / 60)
  if (h < 24) return `Vor ${h} Std.`
  return `Vor ${Math.floor(h / 24)} Tagen`
}

const TAG_COLORS: Record<string, string> = {
  Familie: '#E8B4B8',
  Coaching: '#A8C5DA',
  Paar: '#C4A6E0',
  Team: '#B5D5A7',
  Einzel: '#F2D479',
}

export default function DashboardPage() {
  const [search, setSearch] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [showNew, setShowNew] = useState(false)

  const filtered = DEMO_SESSIONS.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-1 flex-col px-6 py-8 max-w-4xl mx-auto w-full gap-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', color: '#1F4045' }}>
            Meine Sitzungen
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(31,64,69,0.45)', marginTop: 3 }}>
            Demo-Modus · {DEMO_SESSIONS.length} Sitzungen
          </p>
        </div>
        <button
          onClick={() => setShowNew(!showNew)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 100,
            background: '#1F4045', color: 'white',
            fontSize: 13, fontWeight: 500,
            boxShadow: '0 4px 12px rgba(31,64,69,0.2)',
            border: 'none', cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Neue Sitzung
        </button>
      </div>

      {/* New session form */}
      {showNew && (
        <div style={{
          background: 'white', borderRadius: 20, padding: 24,
          border: '1px solid rgba(201,169,110,0.3)',
          boxShadow: '0 8px 32px rgba(31,64,69,0.08)',
        }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1F4045', marginBottom: 12 }}>Neue Sitzung erstellen</p>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="z.B. Familie Huber – Aufstellung, Coaching Max M."
            autoFocus
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 12,
              border: '1px solid rgba(31,64,69,0.15)',
              fontSize: 14, color: '#1F4045', outline: 'none',
              background: '#FAFAF8',
            }}
          />
          <div className="flex gap-2 mt-3">
            <Link
              href={`/session/neue-sitzung`}
              style={{
                flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 12,
                background: '#1F4045', color: 'white', fontSize: 13, fontWeight: 500,
              }}
            >
              Brett öffnen →
            </Link>
            <button
              onClick={() => setShowNew(false)}
              style={{
                padding: '10px 16px', borderRadius: 12, fontSize: 13,
                color: 'rgba(31,64,69,0.5)', border: '1px solid rgba(31,64,69,0.1)',
                background: 'white', cursor: 'pointer',
              }}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.35 }}>
          <circle cx="11" cy="11" r="8" stroke="#1F4045" strokeWidth="1.8"/>
          <path d="M21 21l-4.35-4.35" stroke="#1F4045" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Sitzung suchen…"
          style={{
            width: '100%', padding: '10px 14px 10px 40px',
            borderRadius: 12, border: '1px solid rgba(31,64,69,0.1)',
            fontSize: 13, color: '#1F4045', background: 'white', outline: 'none',
          }}
        />
      </div>

      {/* Session list */}
      <div className="flex flex-col gap-3">
        {filtered.map((session) => (
          <Link
            key={session.id}
            href={`/session/${session.id}`}
            className="group"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '18px 20px', borderRadius: 20,
              background: 'white',
              border: '1px solid rgba(31,64,69,0.07)',
              transition: 'all 0.15s',
              boxShadow: '0 1px 4px rgba(31,64,69,0.04)',
            }}
              className="hover:border-[#C9A96E]/30 hover:shadow-md hover:-translate-y-px transition-all"
            >
              {/* Mini board preview */}
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: 'linear-gradient(135deg, #ede0c4, #d4b87a)',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 4,
                  border: '1.5px solid rgba(80,45,15,0.2)',
                  borderRadius: '50%',
                }} />
                {/* Tiny figure dots */}
                {[[35, 35], [60, 50], [50, 65]].slice(0, Math.min(session.figures, 3)).map(([x, y], i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    width: 6, height: 6, borderRadius: '50%',
                    background: ['#E8B4B8', '#A8C5DA', '#B5D5A7'][i],
                    left: `${x}%`, top: `${y}%`,
                    transform: 'translate(-50%,-50%)',
                    border: '1px solid rgba(255,255,255,0.7)',
                  }} />
                ))}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center gap-2 mb-1">
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1F4045', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session.title}
                  </p>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                    color: TAG_COLORS[session.tag] ? '#1F4045' : '#1F4045',
                    background: TAG_COLORS[session.tag] ? `${TAG_COLORS[session.tag]}33` : 'rgba(31,64,69,0.07)',
                    border: `1px solid ${TAG_COLORS[session.tag] ? `${TAG_COLORS[session.tag]}66` : 'rgba(31,64,69,0.1)'}`,
                    padding: '2px 8px', borderRadius: 100, flexShrink: 0,
                  }}>
                    {session.tag}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 12, color: 'rgba(31,64,69,0.4)' }}>{formatRelative(session.updated_at)}</span>
                  <span style={{ color: 'rgba(31,64,69,0.2)', fontSize: 10 }}>·</span>
                  <span style={{ fontSize: 12, color: 'rgba(31,64,69,0.4)' }}>{session.figures} Figuren</span>
                  {session.snapshots > 0 && (
                    <>
                      <span style={{ color: 'rgba(31,64,69,0.2)', fontSize: 10 }}>·</span>
                      <span style={{ fontSize: 12, color: 'rgba(31,64,69,0.4)' }}>{session.snapshots} Snapshots</span>
                    </>
                  )}
                </div>
              </div>

              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-20 group-hover:opacity-60 transition-opacity shrink-0">
                <path d="M9 18l6-6-6-6" stroke="#1F4045" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(31,64,69,0.35)' }}>
            <p style={{ fontSize: 14 }}>Keine Sitzungen gefunden</p>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sitzungen', value: DEMO_SESSIONS.length },
          { label: 'Figuren gesamt', value: DEMO_SESSIONS.reduce((a, s) => a + s.figures, 0) },
          { label: 'Snapshots', value: DEMO_SESSIONS.reduce((a, s) => a + s.snapshots, 0) },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'white', borderRadius: 16, padding: '20px',
            border: '1px solid rgba(31,64,69,0.07)', textAlign: 'center',
          }}>
            <p style={{ fontSize: 28, fontWeight: 600, color: '#1F4045', letterSpacing: '-0.02em' }}>{value}</p>
            <p style={{ fontSize: 12, color: 'rgba(31,64,69,0.4)', marginTop: 2 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* KI hint */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(31,64,69,0.04) 0%, rgba(201,169,110,0.08) 100%)',
        borderRadius: 20, padding: '20px 24px',
        border: '1px solid rgba(201,169,110,0.2)',
        display: 'flex', alignItems: 'flex-start', gap: 16,
      }}>
        <span style={{ fontSize: 20, color: '#C9A96E', lineHeight: 1, marginTop: 2 }}>✦</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#1F4045', marginBottom: 4 }}>KI-Analyse im Board</p>
          <p style={{ fontSize: 12, color: 'rgba(31,64,69,0.55)', lineHeight: 1.6 }}>
            Im Brett-Tab "KI" beschreibt Claude phänomenologisch was es in der Aufstellung sieht — Positionen, Blickrichtungen, Verbindungen. Keine Interpretationen, nur systemische Beobachtungen.
          </p>
        </div>
      </div>
    </div>
  )
}
