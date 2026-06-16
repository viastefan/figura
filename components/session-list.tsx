'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Session } from '@/types/database'

export function SessionList({ sessions: initial }: { sessions: Session[] }) {
  const [sessions, setSessions] = useState(initial)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const active = sessions.filter((s) => s.status === 'active')
  const archived = sessions.filter((s) => s.status === 'archived')

  async function handleRename(id: string) {
    if (!editTitle.trim()) return
    await supabase
      .from('sessions')
      .update({ title: editTitle.trim(), updated_at: new Date().toISOString() })
      .eq('id', id)

    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: editTitle.trim() } : s))
    )
    setEditingId(null)
  }

  async function handleArchive(id: string) {
    await supabase
      .from('sessions')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', id)

    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'archived' as const } : s
      )
    )
  }

  async function handleRestore(id: string) {
    await supabase
      .from('sessions')
      .update({ status: 'active', updated_at: new Date().toISOString() })
      .eq('id', id)

    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'active' as const } : s
      )
    )
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  function SessionCard({ session }: { session: Session }) {
    const isEditing = editingId === session.id

    return (
      <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors">
        <div className="flex-1 min-w-0 mr-4">
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleRename(session.id)
              }}
              className="flex gap-2"
            >
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="h-8"
              />
              <Button type="submit" size="sm" variant="outline">
                OK
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setEditingId(null)}
              >
                Abbrechen
              </Button>
            </form>
          ) : (
            <>
              <p className="font-medium truncate">{session.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(session.updated_at)}
              </p>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1">
            {session.status === 'active' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push(`/session/${session.id}`)}
              >
                Öffnen
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditingId(session.id)
                setEditTitle(session.title)
              }}
            >
              Umbenennen
            </Button>
            {session.status === 'active' ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleArchive(session.id)}
              >
                Archivieren
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRestore(session.id)}
              >
                Wiederherstellen
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">
        Noch keine Sitzungen vorhanden. Erstelle deine erste Sitzung.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {active.length > 0 && (
        <div className="space-y-3">
          {active.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}

      {archived.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Archiviert</h2>
          {archived.map((s) => (
            <SessionCard key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  )
}
