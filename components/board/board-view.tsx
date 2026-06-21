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

  useEffect(() => {
    setFigures(initialFigures)
  }, [initialFigures, setFigures])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event
      const figure = figures.find((f) => f.id === active.id)
      if (!figure) return
      const newX = Math.max(0, figure.x + delta.x)
      const newY = Math.max(0, figure.y + delta.y)
      updateFigure(figure.id, { x: newX, y: newY })
    },
    [figures, updateFigure]
  )

  function handleAddFigure(shape: Shape, color: string) {
    const newFigure: Figure = {
      id: crypto.randomUUID(),
      session_id: session.id,
      shape,
      color,
      label: '',
      x: 280 + Math.random() * 240,
      y: 180 + Math.random() * 200,
      rotation: 0,
      z_index: getMaxZIndex() + 1,
      updated_at: new Date().toISOString(),
    }
    addFigure(newFigure)
  }

  function handleBoardClick() {
    selectFigure(null)
  }

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-57px)]">
      {/* Session toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-white/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            ← Zurück
          </Link>
          <span className="text-sm font-medium">{session.title}</span>
        </div>
        {isOwner && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              Demo — Echtzeit-Sync kommt bald
            </span>
          </div>
        )}
      </div>

      {/* Board area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
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
              background: 'linear-gradient(135deg, #f5e6c8 0%, #e8d5a8 50%, #dcc89a 100%)',
              backgroundImage: `
                linear-gradient(135deg, #f5e6c8 0%, #e8d5a8 50%, #dcc89a 100%),
                repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.025) 40px, rgba(0,0,0,0.025) 41px),
                repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.025) 40px, rgba(0,0,0,0.025) 41px)
              `,
            }}
            onClick={handleBoardClick}
          >
            <div className="min-w-[1200px] min-h-[800px] relative">
              {figures.map((figure) => (
                <BoardFigure key={figure.id} figure={figure} />
              ))}

              {figures.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center space-y-2 opacity-40">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto">
                      <circle cx="8" cy="8" r="4" stroke="#1F4045" strokeWidth="1.5" />
                      <circle cx="16" cy="14" r="4" stroke="#1F4045" strokeWidth="1.5" />
                      <path d="M8 12v4M8 16h4" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <p className="text-sm font-medium text-[#1F4045]">Systembrett ist leer</p>
                    <p className="text-xs text-[#1F4045]">Figuren aus der Palette hinzufügen</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  )
}
