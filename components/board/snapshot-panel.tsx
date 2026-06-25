'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure, Connection } from '@/types/database'

interface Snap {
  id: string
  note: string | null
  figures: Figure[]
  connections: Connection[]
  created_at: string
}

export function SnapshotPanel({ sessionId: _ }: { sessionId: string }) {
  const { figures, connections, setFigures, setConnections } = useBoardStore()
  const [snaps, setSnaps] = useState<Snap[]>([])
  const [note, setNote] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  function save() {
    if (figures.length === 0) return
    setSnaps(prev => [{
      id: crypto.randomUUID(),
      note: note.trim() || null,
      figures: JSON.parse(JSON.stringify(figures)),
      connections: JSON.parse(JSON.stringify(connections)),
      created_at: new Date().toISOString(),
    }, ...prev])
    setNote('')
  }

  function load(s: Snap) {
    setFigures(s.figures.map(f => ({ ...f, id: crypto.randomUUID(), updated_at: new Date().toISOString() })))
    setConnections(s.connections ?? [])
    setConfirmId(null)
  }

  function fmt(d: string) {
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#1F4045', marginBottom: 4 }}>Aufstellung sichern</p>
        <p style={{ fontSize: 11, color: 'rgba(31,64,69,0.45)', lineHeight: 1.5 }}>
          Snapshot = Momentaufnahme des Bretts mit allen Figuren und Verbindungen.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Notiz optional…"
          onKeyDown={e => e.key === 'Enter' && save()}
          style={{
            flex: 1, padding: '8px 12px', borderRadius: 10,
            border: '1px solid rgba(31,64,69,0.12)',
            fontSize: 12, color: '#1F4045', background: 'white', outline: 'none',
          }}
        />
        <button onClick={save} disabled={figures.length === 0}
          style={{
            padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
            background: figures.length > 0 ? '#1F4045' : 'rgba(31,64,69,0.15)',
            color: figures.length > 0 ? 'white' : 'rgba(31,64,69,0.35)',
            border: 'none', cursor: figures.length > 0 ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap',
          }}>
          Speichern
        </button>
      </div>

      {snaps.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(31,64,69,0.4)', textTransform: 'uppercase' }}>
            {snaps.length} Snapshots
          </p>
          <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
            {snaps.map((s, i) => (
              <div key={s.id} style={{
                background: 'white', borderRadius: 12, padding: '12px 14px',
                border: '1px solid rgba(31,64,69,0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#C9A96E',
                    background: 'rgba(201,169,110,0.12)', padding: '2px 7px',
                    borderRadius: 100, flexShrink: 0, marginTop: 1,
                  }}>#{snaps.length - i}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1F4045', marginBottom: 2 }}>
                      {s.note || fmt(s.created_at)}
                    </p>
                    <p style={{ fontSize: 10, color: 'rgba(31,64,69,0.4)' }}>
                      {s.note ? fmt(s.created_at) + ' · ' : ''}{s.figures.length} Figuren · {s.connections.length} Verbindungen
                    </p>
                  </div>
                  {confirmId === s.id ? (
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button onClick={() => load(s)} style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: '#1F4045', color: 'white', border: 'none', cursor: 'pointer' }}>Laden</button>
                      <button onClick={() => setConfirmId(null)} style={{ padding: '3px 6px', borderRadius: 6, fontSize: 11, color: 'rgba(31,64,69,0.5)', border: '1px solid rgba(31,64,69,0.1)', background: 'white', cursor: 'pointer' }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmId(s.id)} style={{
                      padding: '3px 10px', borderRadius: 6, fontSize: 11,
                      color: 'rgba(31,64,69,0.5)', border: '1px solid rgba(31,64,69,0.1)',
                      background: 'white', cursor: 'pointer', flexShrink: 0,
                    }}>Laden</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center', padding: '28px 16px',
          background: 'rgba(31,64,69,0.03)', borderRadius: 14,
          border: '1px dashed rgba(31,64,69,0.12)',
        }}>
          <p style={{ fontSize: 12, color: 'rgba(31,64,69,0.35)', lineHeight: 1.6 }}>
            Noch keine Snapshots.
          </p>
        </div>
      )}
    </div>
  )
}
