'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

interface Snap {
  id: string
  note: string | null
  state: Figure[]
  created_at: string
}

export function SnapshotPanel({ sessionId: _ }: { sessionId: string }) {
  const { figures, setFigures } = useBoardStore()
  const [snaps, setSnaps] = useState<Snap[]>([])
  const [note, setNote] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)

  function save() {
    if (figures.length === 0) return
    setSnaps(prev => [{
      id: crypto.randomUUID(),
      note: note.trim() || null,
      state: JSON.parse(JSON.stringify(figures)),
      created_at: new Date().toISOString(),
    }, ...prev])
    setNote('')
  }

  function load(s: Snap) {
    setFigures(s.state.map(f => ({ ...f, id: crypto.randomUUID(), updated_at: new Date().toISOString() })))
    setConfirmId(null)
  }

  function fmt(d: string) {
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#1F4045', marginBottom: 4 }}>Aufstellung speichern</p>
        <p style={{ fontSize: 11, color: 'rgba(31,64,69,0.45)', lineHeight: 1.5 }}>
          Snapshot erstellt eine Momentaufnahme des Bretts — damit wird Entwicklung über Sitzungen sichtbar.
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Notiz, z.B. «Beginn Sitzung 2»"
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 10,
            border: '1px solid rgba(31,64,69,0.12)', fontSize: 12,
            color: '#1F4045', background: 'white', outline: 'none',
          }}
          onKeyDown={e => e.key === 'Enter' && save()}
        />
        <button
          onClick={save}
          disabled={figures.length === 0}
          style={{
            padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
            background: figures.length === 0 ? 'rgba(31,64,69,0.15)' : '#1F4045',
            color: figures.length === 0 ? 'rgba(31,64,69,0.4)' : 'white',
            border: 'none', cursor: figures.length === 0 ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Speichern
        </button>
      </div>

      {snaps.length > 0 && (
        <div className="flex flex-col gap-2">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(31,64,69,0.4)', textTransform: 'uppercase' }}>
            {snaps.length} Snapshots
          </p>
          <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {snaps.map((s, i) => (
              <div
                key={s.id}
                style={{
                  background: 'white', borderRadius: 12, padding: '12px 14px',
                  border: `1px solid ${previewId === s.id ? 'rgba(201,169,110,0.5)' : 'rgba(31,64,69,0.08)'}`,
                  transition: 'all 0.1s',
                }}
                onMouseEnter={() => setPreviewId(s.id)}
                onMouseLeave={() => setPreviewId(null)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: '#C9A96E',
                        background: 'rgba(201,169,110,0.12)', padding: '1px 6px', borderRadius: 100,
                      }}>
                        #{snaps.length - i}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#1F4045' }}>
                        {s.note || fmt(s.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.note && <span style={{ fontSize: 10, color: 'rgba(31,64,69,0.4)' }}>{fmt(s.created_at)}</span>}
                      <span style={{ fontSize: 10, color: 'rgba(31,64,69,0.4)' }}>· {s.state.length} Figuren</span>
                    </div>
                  </div>

                  {confirmId === s.id ? (
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => load(s)} style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: '#1F4045', color: 'white', border: 'none', cursor: 'pointer' }}>Laden</button>
                      <button onClick={() => setConfirmId(null)} style={{ padding: '4px 8px', borderRadius: 8, fontSize: 11, color: 'rgba(31,64,69,0.5)', border: '1px solid rgba(31,64,69,0.1)', background: 'white', cursor: 'pointer' }}>Nein</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(s.id)}
                      style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, color: 'rgba(31,64,69,0.5)', border: '1px solid rgba(31,64,69,0.1)', background: 'white', cursor: 'pointer', flexShrink: 0 }}
                    >
                      Laden
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {snaps.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '28px 16px',
          background: 'rgba(31,64,69,0.03)', borderRadius: 14,
          border: '1px dashed rgba(31,64,69,0.12)',
        }}>
          <p style={{ fontSize: 12, color: 'rgba(31,64,69,0.35)', lineHeight: 1.6 }}>
            Noch keine Snapshots.<br />Brett-Zustand festhalten um Entwicklung zu dokumentieren.
          </p>
        </div>
      )}
    </div>
  )
}
