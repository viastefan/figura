'use client'

import { useState, useEffect, useCallback } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Snapshot, Figure } from '@/types/database'

export function SnapshotPanel({ sessionId }: { sessionId: string }) {
  const { figures, setFigures } = useBoardStore()
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmLoad, setConfirmLoad] = useState<string | null>(null)
  const supabase = createClient()

  const loadSnapshots = useCallback(async () => {
    const { data } = await supabase
      .from('snapshots')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
    if (data) setSnapshots(data)
  }, [sessionId, supabase])

  useEffect(() => {
    loadSnapshots()
  }, [loadSnapshots])

  async function handleSave() {
    setSaving(true)
    const snapshot = {
      session_id: sessionId,
      note: note.trim() || null,
      state: figures as unknown as Record<string, unknown>[],
    }

    const { data } = await supabase
      .from('snapshots')
      .insert(snapshot)
      .select()
      .single()

    if (data) {
      setSnapshots((prev) => [data, ...prev])
      setNote('')
    }
    setSaving(false)
  }

  async function handleLoad(snapshot: Snapshot) {
    const state = snapshot.state as unknown as Figure[]

    // Delete current figures and insert snapshot state
    await supabase.from('figures').delete().eq('session_id', sessionId)

    const figuresToInsert = state.map((f) => ({
      id: crypto.randomUUID(),
      session_id: sessionId,
      shape: f.shape,
      color: f.color,
      label: f.label,
      x: f.x,
      y: f.y,
      rotation: f.rotation,
      z_index: f.z_index,
    }))

    if (figuresToInsert.length > 0) {
      await supabase.from('figures').insert(figuresToInsert)
    }

    // Update local state
    setFigures(
      figuresToInsert.map((f) => ({
        ...f,
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
          disabled={saving}
        >
          {saving ? '...' : 'Speichern'}
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
                <p className="truncate">
                  {s.note || formatTime(s.created_at)}
                </p>
                {s.note && (
                  <p className="text-muted-foreground">
                    {formatTime(s.created_at)}
                  </p>
                )}
              </div>
              {confirmLoad === s.id ? (
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2"
                    onClick={() => handleLoad(s)}
                  >
                    Ja
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[10px] px-2"
                    onClick={() => setConfirmLoad(null)}
                  >
                    Nein
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 text-[10px] px-2 shrink-0"
                  onClick={() => setConfirmLoad(s.id)}
                >
                  Laden
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
