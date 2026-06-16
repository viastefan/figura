'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

export function useRealtimeFigures(sessionId: string) {
  const { addFigure, updateFigure, removeFigure, figures } = useBoardStore()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`figures:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'figures',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newFigure = payload.new as Figure
          const exists = useBoardStore.getState().figures.some((f) => f.id === newFigure.id)
          if (!exists) {
            addFigure(newFigure)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'figures',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const updated = payload.new as Figure
          updateFigure(updated.id, updated)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'figures',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const old = payload.old as { id: string }
          removeFigure(old.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId, addFigure, updateFigure, removeFigure])
}
