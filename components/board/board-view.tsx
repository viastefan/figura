'use client'

import { useEffect, useCallback } from 'react'
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useBoardStore } from '@/lib/store/board-store'
import { createClient } from '@/lib/supabase/client'
import { useRealtimeFigures } from '@/lib/realtime/use-realtime-figures'
import { BoardFigure } from './board-figure'
import { FigurePalette } from './figure-palette'
import { FigureControls } from './figure-controls'
import { SnapshotPanel } from './snapshot-panel'
import type { Session, Figure, Shape } from '@/types/database'
import Link from 'next/link'

export function BoardView({
  session,
  initialFigures,
  isOwner,
}: {
  session: Session
  initialFigures: Figure[]
  isOwner: boolean
}) {
  const { figures, setFigures, addFigure, updateFigure, selectFigure, getMaxZIndex } =
    useBoardStore()
  const supabase = createClient()

  useEffect(() => {
    setFigures(initialFigures)
  }, [initialFigures, setFigures])

  useRealtimeFigures(session.id)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, delta } = event
      const figure = figures.find((f) => f.id === active.id)
      if (!figure) return

      const newX = Math.max(0, figure.x + delta.x)
      const newY = Math.max(0, figure.y + delta.y)

      updateFigure(figure.id, { x: newX, y: newY })

      await supabase
        .from('figures')
        .update({
          x: newX,
          y: newY,
          updated_at: new Date().toISOString(),
        })
        .eq('id', figure.id)
    },
    [figures, updateFigure, supabase]
  )

  async function handleAddFigure(shape: Shape, color: string) {
    const newFigure: Omit<Figure, 'updated_at'> & { updated_at?: string } = {
      id: crypto.randomUUID(),
      session_id: session.id,
      shape,
      color,
      label: '',
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      rotation: 0,
      z_index: getMaxZIndex() + 1,
    }

    addFigure(newFigure as Figure)

    await supabase.from('figures').insert(newFigure)
  }

  function handleBoardClick() {
    selectFigure(null)
  }

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-57px)]">
      {/* Session toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; Zurück
          </Link>
          <span className="text-sm font-medium">{session.title}</span>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <CopyLinkButton token={session.client_token} />
          </div>
        )}
      </div>

      {/* Board area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: palette + controls */}
        <div className="w-56 border-r p-3 flex flex-col gap-3 overflow-y-auto bg-white/50">
          <FigurePalette onAdd={handleAddFigure} />
          <FigureControls sessionId={session.id} />
          {isOwner && <SnapshotPanel sessionId={session.id} />}
        </div>

        {/* Board canvas */}
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="flex-1 relative overflow-auto"
            style={{
              background:
                'linear-gradient(135deg, #f5e6c8 0%, #e8d5a8 50%, #dcc89a 100%)',
              backgroundImage: `
                linear-gradient(135deg, #f5e6c8 0%, #e8d5a8 50%, #dcc89a 100%),
                repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.02) 40px, rgba(0,0,0,0.02) 41px),
                repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.02) 40px, rgba(0,0,0,0.02) 41px)
              `,
            }}
            onClick={handleBoardClick}
          >
            <div className="min-w-[1200px] min-h-[800px] relative">
              {figures.map((figure) => (
                <BoardFigure key={figure.id} figure={figure} />
              ))}
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  )
}

function CopyLinkButton({ token }: { token: string }) {
  async function handleCopy() {
    const url = `${window.location.origin}/join/${token}`
    await navigator.clipboard.writeText(url)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors"
    >
      Einladungslink kopieren
    </button>
  )
}
