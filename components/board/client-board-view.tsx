'use client'

import { useEffect, useState } from 'react'
import { BoardView } from './board-view'
import type { Session, Figure } from '@/types/database'

export function ClientBoardView({ token }: { token: string }) {
  const [session, setSession] = useState<Session | null>(null)
  const [figures, setFigures] = useState<Figure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/join/${token}`)
        if (!res.ok) {
          setError('Sitzung nicht gefunden oder Link ungültig.')
          setLoading(false)
          return
        }
        const data = await res.json()
        setSession(data.session)
        setFigures(data.figures)
      } catch {
        setError('Verbindung fehlgeschlagen.')
      }
      setLoading(false)
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Sitzung wird geladen...</p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return <BoardView session={session} initialFigures={figures} isOwner={false} />
}
