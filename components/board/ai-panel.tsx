'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

const COLOR_MEANINGS: Record<string, string> = {
  '#E8B4B8': 'fürsorglich',
  '#A8C5DA': 'ruhig/distanziert',
  '#B5D5A7': 'wachsend',
  '#F2D479': 'energetisch',
  '#C4A6E0': 'intuitiv',
  '#F5C5A3': 'warm',
  '#94A3B8': 'abgrenzend',
  '#F87171': 'in Konflikt',
  '#6B8F71': 'stabil/geerdet',
  '#D4A5A5': 'in Trauer/Verlust',
}

function buildDesc(figures: Figure[], connections: { fromId: string; toId: string }[]): string {
  if (figures.length === 0) return 'Keine Figuren.'
  const cx = 550, cy = 370
  return figures.map(f => {
    const dx = (f.x + 32) - cx, dy = (f.y + 40) - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const zone = dist < 120 ? 'im Zentrum' : dist < 260 ? 'in der Mitte' : dist < 400 ? 'außen' : 'am Rand'
    const r = ((f.rotation % 360) + 360) % 360
    const dir = r < 22.5 || r >= 337.5 ? 'schaut nach vorne/oben'
      : r < 67.5 ? 'schaut nach rechts-oben' : r < 112.5 ? 'schaut nach rechts'
      : r < 157.5 ? 'schaut nach rechts-unten' : r < 202.5 ? 'schaut nach unten/hinten'
      : r < 247.5 ? 'schaut nach links-unten' : r < 292.5 ? 'schaut nach links'
      : 'schaut nach links-oben'
    const cm = COLOR_MEANINGS[f.color] ?? 'neutral'
    const name = f.label ? `"${f.label}"` : '(unbenannt)'
    const conns = connections.filter(c => c.fromId === f.id || c.toId === f.id)
      .map(c => figures.find(x => x.id === (c.fromId === f.id ? c.toId : c.fromId))?.label ?? '?')
      .filter(Boolean)
    return `${name}: ${zone}, ${dir}, Bedeutung: ${cm}${conns.length ? `, verbunden mit: ${conns.join(', ')}` : ''}`
  }).join('\n')
}

const QUICK = [
  'Was fällt dir als erstes auf?',
  'Wer scheint isoliert oder ausgeschlossen?',
  'Welche Beziehungen wirken angespannt?',
  'Was könnte ein hilfreicher nächster Schritt sein?',
  'Wie wirkt das Zentrum des Systems?',
]

export function AiPanel({ sessionTitle }: { sessionTitle: string }) {
  const { figures, connections } = useBoardStore()
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [activeQ, setActiveQ] = useState<string | null>(null)

  async function ask(q?: string) {
    if (figures.length === 0) return
    setLoading(true)
    setResponse('')
    setActiveQ(q ?? null)

    const desc = buildDesc(figures, connections)
    const isCustom = !!q

    const prompt = isCustom
      ? `Du bist ein erfahrener systemischer Berater. Sitzung: "${sessionTitle}"\n\nAufstellung:\n${desc}\n\nFrage: ${q}\n\nAntworte in 2-4 Sätzen. Phänomenologisch, systemisch, keine Bewertung.`
      : `Du bist ein erfahrener systemischer Berater. Sitzung: "${sessionTitle}"\n\nAufstellung:\n${desc}\n\nBeschreibe in 4-5 Sätzen was du phänomenologisch siehst: Nähe/Distanz, Blickrichtungen (wer schaut wen an, wer schaut weg), Zentrum/Peripherie, Verbindungen. Keine Interpretationen. Systemische Sprache.`

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setResponse(data.text || 'Keine Antwort.')
    } catch {
      setResponse('Verbindungsfehler.')
    }
    setLoading(false)
  }

  const hasBoard = figures.length > 0

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span style={{ color: '#C9A96E', fontSize: 16 }}>✦</span>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#1F4045' }}>KI-Perspektive</p>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(31,64,69,0.45)', lineHeight: 1.5 }}>
          Claude liest Positionen, Blickrichtungen und Verbindungen — und beschreibt was es phänomenologisch wahrnimmt.
        </p>
      </div>

      {/* Main button */}
      <button
        onClick={() => ask()}
        disabled={loading || !hasBoard}
        style={{
          width: '100%', padding: '12px', borderRadius: 14,
          background: hasBoard ? '#1F4045' : 'rgba(31,64,69,0.15)',
          color: hasBoard ? 'white' : 'rgba(31,64,69,0.4)',
          fontSize: 13, fontWeight: 600, border: 'none',
          cursor: hasBoard && !loading ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: hasBoard ? '0 4px 14px rgba(31,64,69,0.2)' : 'none',
          transition: 'all 0.15s',
        }}
      >
        {loading && !activeQ ? (
          <>
            <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
            Analysiere…
          </>
        ) : (
          <> ✦ Aufstellung analysieren</>
        )}
      </button>

      {!hasBoard && (
        <p style={{ fontSize: 11, color: 'rgba(31,64,69,0.35)', textAlign: 'center', fontStyle: 'italic' }}>
          Erst Figuren auf das Brett setzen
        </p>
      )}

      {/* Quick questions */}
      {hasBoard && (
        <div className="flex flex-col gap-1.5">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(31,64,69,0.4)', textTransform: 'uppercase', marginBottom: 2 }}>
            Schnellfragen
          </p>
          {QUICK.map(q => (
            <button
              key={q}
              onClick={() => { setQuestion(q); ask(q) }}
              disabled={loading}
              style={{
                textAlign: 'left', padding: '8px 12px', borderRadius: 10,
                background: activeQ === q && loading ? 'rgba(31,64,69,0.06)' : 'white',
                border: '1px solid rgba(31,64,69,0.09)',
                fontSize: 12, color: 'rgba(31,64,69,0.65)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading && activeQ !== q ? 0.5 : 1,
                transition: 'all 0.1s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              className="hover:border-[#C9A96E]/30 hover:text-[#1F4045] transition-all"
            >
              {activeQ === q && loading ? (
                <span style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid rgba(31,64,69,0.2)', borderTopColor: '#1F4045', display: 'inline-block', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              ) : (
                <span style={{ color: '#C9A96E', flexShrink: 0 }}>→</span>
              )}
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Custom question */}
      {hasBoard && (
        <div className="flex flex-col gap-2">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(31,64,69,0.4)', textTransform: 'uppercase' }}>
            Eigene Frage
          </p>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="z.B. Was könntest du über die Beziehung zwischen Mutter und Kind sagen?"
            style={{
              width: '100%', padding: '10px 12px', borderRadius: 12,
              border: '1px solid rgba(31,64,69,0.12)',
              fontSize: 12, color: '#1F4045', background: 'white',
              outline: 'none', resize: 'none', height: 72,
              lineHeight: 1.5,
            }}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) ask(question) }}
          />
          <button
            onClick={() => ask(question)}
            disabled={loading || !question.trim()}
            style={{
              width: '100%', padding: '9px', borderRadius: 10,
              background: 'white', color: question.trim() ? '#1F4045' : 'rgba(31,64,69,0.3)',
              fontSize: 12, fontWeight: 500,
              border: `1px solid ${question.trim() ? 'rgba(31,64,69,0.2)' : 'rgba(31,64,69,0.08)'}`,
              cursor: question.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            Frage stellen →
          </button>
        </div>
      )}

      {/* Response */}
      {response && (
        <div style={{
          background: 'white', borderRadius: 16, padding: 16,
          border: '1px solid rgba(201,169,110,0.25)',
          boxShadow: '0 4px 16px rgba(31,64,69,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 14, color: '#C9A96E' }}>✦</span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(201,169,110,0.9)', textTransform: 'uppercase' }}>
              KI-Wahrnehmung
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(31,64,69,0.75)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {response}
          </p>
          <button
            onClick={() => setResponse('')}
            style={{ marginTop: 10, fontSize: 11, color: 'rgba(31,64,69,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Schließen
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
