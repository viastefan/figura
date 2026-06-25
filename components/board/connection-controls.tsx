'use client'

import { useBoardStore } from '@/lib/store/board-store'
import type { ConnectionSemantics } from '@/types/database'

const SEMANTICS: { value: ConnectionSemantics; label: string; color: string; desc: string }[] = [
  { value: 'neutral',  label: 'Neutral',   color: '#5c3d1e', desc: 'Einfache Verbindung' },
  { value: 'strong',   label: 'Stark',     color: '#1F4045', desc: 'Enge Bindung, tiefe Verbundenheit' },
  { value: 'weak',     label: 'Schwach',   color: '#94A3B8', desc: 'Locker, kaum Kontakt' },
  { value: 'conflict', label: 'Konflikt',  color: '#ef4444', desc: 'Spannung, Streit, Ablehnung' },
  { value: 'resource', label: 'Ressource', color: '#6B8F71', desc: 'Halt, Unterstützung, Kraft' },
]

export function ConnectionControls() {
  const { connections, selectedConnectionId, updateConnection, removeConnection, selectConnection } = useBoardStore()

  const conn = connections.find(c => c.id === selectedConnectionId)
  if (!conn) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p style={{ fontSize: 11, fontWeight: 600, color: '#1F4045' }}>Verbindung bearbeiten</p>
        <button onClick={() => selectConnection(null)} style={{ fontSize: 18, color: 'rgba(31,64,69,0.3)', background: 'none', border: 'none', cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>

      <div className="flex flex-col gap-2">
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(31,64,69,0.4)', textTransform: 'uppercase' }}>Art der Verbindung</p>
        {SEMANTICS.map(s => (
          <button
            key={s.value}
            onClick={() => updateConnection(conn.id, { semantics: s.value, color: s.color, style: s.value === 'weak' || s.value === 'conflict' || s.value === 'resource' ? 'dashed' : 'solid' })}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 12,
              background: conn.semantics === s.value ? `${s.color}12` : 'white',
              border: `1.5px solid ${conn.semantics === s.value ? s.color : 'rgba(31,64,69,0.08)'}`,
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.1s',
            }}
          >
            {/* Line preview */}
            <svg width="28" height="12" viewBox="0 0 28 12">
              <line x1="2" y1="6" x2="26" y2="6"
                stroke={s.color}
                strokeWidth={s.value === 'strong' ? 3 : s.value === 'weak' ? 1.5 : 2}
                strokeDasharray={s.value === 'weak' || s.value === 'conflict' ? '4,3' : s.value === 'resource' ? '6,3' : undefined}
                strokeLinecap="round" />
            </svg>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#1F4045' }}>{s.label}</p>
              <p style={{ fontSize: 10, color: 'rgba(31,64,69,0.45)' }}>{s.desc}</p>
            </div>
            {conn.semantics === s.value && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                <path d="M20 6L9 17l-5-5" stroke={s.color} strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => { removeConnection(conn.id); selectConnection(null) }}
        style={{
          width: '100%', padding: '9px', borderRadius: 10,
          background: 'rgba(239,68,68,0.06)', color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.15)', fontSize: 12,
          fontWeight: 500, cursor: 'pointer',
        }}
      >
        Verbindung entfernen
      </button>
    </div>
  )
}
