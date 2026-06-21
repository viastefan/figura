'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

interface LocalSnapshot {
  id: string
  note: string | null
  state: Figure[]
  created_at: string
}

export function SnapshotPanel({ sessionId: _ }: { sessionId: string }) {
  const { figures, setFigures } = useBoardStore()
  const [snapshots, setSnapshots] = useState<LocalSnapshot[]>([])
  const [note, setNote] = useState('')
  const [confirmLoad, setConfirmLoad] = useState<string | null>(null)

  function handleSave() {
    const snapshot: LocalSnapshot = {
      id: crypto.randomUUID(),
      note: note.trim() || null,
      state: JSON.parse(JSON.stringify(figures)),
      created_at: new Date().toISOString(),
    }
    setSnapshots((prev) => [snapshot, ...prev])
    setNote('')
  }

  function handleLoad(snapshot: LocalSnapshot) {
    setFigures(snapshot.state.map((f) => ({ ...f, id: crypto.randomUUID(), updated_at: new Date().toISOString() })))
    setConfirmLoad(null)
  }

  function formatTime(date: string) {
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest px-1">
        Snapshots
      </span>
      <div className="flex gap-1.5">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notiz (optional)..."
          className="flex-1 text-[11px] px-2 py-1.5 rounded-lg bg-white/70 border border-white/80 focus:outline-none focus:bg-white placeholder:text-[#1F4045]/30 text-[#1F4045]"
        />
        <button
          onClick={handleSave}
          disabled={figures.length === 0}
          className="px-2.5 py-1.5 text-[11px] rounded-lg bg-white/80 border border-white/80 text-[#1F4045]/70 hover:bg-white hover:text-[#1F4045] disabled:opacity-40 transition-all"
        >
          Speichern
        </button>
      </div>

      {snapshots.length > 0 ? (
        <div className="flex flex-col gap-1 max-h-36 overflow-y-auto">
          {snapshots.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-[11px] p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1F4045]/80 truncate">{s.note || formatTime(s.created_at)}</p>
                {s.note && <p className="text-[#1F4045]/40">{formatTime(s.created_at)}</p>}
              </div>
              {confirmLoad === s.id ? (
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => handleLoad(s)} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1F4045] text-white">Ja</button>
                  <button onClick={() => setConfirmLoad(null)} className="text-[10px] px-1.5 py-0.5 rounded bg-white/80 text-[#1F4045]/60">Nein</button>
                </div>
              ) : (
                <button onClick={() => setConfirmLoad(s.id)} className="text-[10px] px-2 py-0.5 rounded-md bg-white/80 text-[#1F4045]/60 hover:text-[#1F4045] shrink-0">
                  Laden
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-[#1F4045]/40 italic">
          Board-Zustand speichern um Entwicklung zu dokumentieren.
        </p>
      )}
    </div>
  )
}
