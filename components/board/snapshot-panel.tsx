'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    setFigures(
      snapshot.state.map((f) => ({
        ...f,
        id: crypto.randomUUID(),
        updated_at: new Date().toISOString(),
      }))
    )
    setConfirmLoad(null)
  }

  function formatTime(date: string) {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <div className="flex flex-col gap-3 p-3 bg-white/90 backdrop-blur rounded-lg border shadow-sm">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Snapshots
      </span>

      <div className="flex gap-1.5">
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notiz (optional)..."
          className="h-7 text-xs"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs shrink-0"
          onClick={handleSave}
        >
          Speichern
        </Button>
      </div>

      {snapshots.length > 0 && (
        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
          {snapshots.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate">{s.note || formatTime(s.created_at)}</p>
                {s.note && (
                  <p className="text-muted-foreground">{formatTime(s.created_at)}</p>
                )}
              </div>
              {confirmLoad === s.id ? (
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="outline" className="h-6 text-[10px] px-2" onClick={() => handleLoad(s)}>Ja</Button>
                  <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => setConfirmLoad(null)}>Nein</Button>
                </div>
              ) : (
                <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2 shrink-0" onClick={() => setConfirmLoad(s.id)}>
                  Laden
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {snapshots.length === 0 && (
        <p className="text-[10px] text-muted-foreground italic">
          Noch keine Snapshots. Board-Zustand speichern um Entwicklung zu dokumentieren.
        </p>
      )}
    </div>
  )
}
