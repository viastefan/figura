'use client'

import { useEffect, useCallback, useState } from 'react'
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useBoardStore } from '@/lib/store/board-store'
import { BoardFigure } from './board-figure'
import { FigurePalette } from './figure-palette'
import { FigureControls } from './figure-controls'
import { SnapshotPanel } from './snapshot-panel'
import { ConnectionsLayer } from './connections-layer'
import { AiPanel } from './ai-panel'
import type { Session, Figure, Shape } from '@/types/database'
import Link from 'next/link'

type Tab = 'figuren' | 'ausgewaehlt' | 'snapshots' | 'ki'

export function BoardView({
  session,
  initialFigures,
  isOwner,
}: {
  session: Session
  initialFigures: Figure[]
  isOwner: boolean
}) {
  const { figures, setFigures, addFigure, updateFigure, selectFigure, getMaxZIndex, selectedId, connectingFrom } =
    useBoardStore()
  const [tab, setTab] = useState<Tab>('figuren')

  useEffect(() => {
    setFigures(initialFigures)
  }, [initialFigures, setFigures])

  // Auto-switch to "ausgewaehlt" tab when something is selected
  useEffect(() => {
    if (selectedId) setTab('ausgewaehlt')
  }, [selectedId])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 3 } }))

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, delta } = event
      const figure = figures.find((f) => f.id === active.id)
      if (!figure) return
      updateFigure(figure.id, {
        x: Math.max(0, figure.x + delta.x),
        y: Math.max(0, figure.y + delta.y),
        z_index: getMaxZIndex() + 1,
      })
    },
    [figures, updateFigure, getMaxZIndex]
  )

  function handleAddFigure(shape: Shape, color: string) {
    const fig: Figure = {
      id: crypto.randomUUID(),
      session_id: session.id,
      shape,
      color,
      label: '',
      x: 320 + Math.random() * 300,
      y: 160 + Math.random() * 200,
      rotation: 0,
      z_index: getMaxZIndex() + 1,
      updated_at: new Date().toISOString(),
    }
    addFigure(fig)
    selectFigure(fig.id)
  }

  function handleBoardClick() {
    selectFigure(null)
  }

  const tabs: { id: Tab; label: string; show?: boolean }[] = [
    { id: 'figuren', label: 'Figuren' },
    { id: 'ausgewaehlt', label: 'Bearbeiten', show: !!selectedId },
    { id: 'snapshots', label: 'Verlauf' },
    { id: 'ki', label: '✦ KI' },
  ]

  return (
    <div className="flex flex-1 flex-col" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-5 py-2 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-[#1F4045]/50 hover:text-[#1F4045] transition-colors flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Übersicht
          </Link>
          <span className="text-[#1F4045]/20">·</span>
          <span className="text-sm font-medium text-[#1F4045]">{session.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {connectingFrom && (
            <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full animate-pulse">
              → Ziel-Figur anklicken
            </span>
          )}
          <span className="text-[11px] text-[#1F4045]/40 bg-[#C9A96E]/10 px-2.5 py-1 rounded-full">
            {figures.length} {figures.length === 1 ? 'Figur' : 'Figuren'}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className="w-60 flex flex-col border-r overflow-hidden"
          style={{ background: 'rgba(245,238,224,0.85)', backdropFilter: 'blur(12px)' }}
        >
          {/* Tab bar */}
          <div className="flex border-b border-[#C9A96E]/20 overflow-x-auto">
            {tabs.filter(t => t.show !== false).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 min-w-0 px-2 py-2.5 text-[10px] font-semibold transition-all whitespace-nowrap ${
                  tab === t.id
                    ? 'text-[#1F4045] border-b-2 border-[#C9A96E]'
                    : 'text-[#1F4045]/40 hover:text-[#1F4045]/70'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-3">
            {tab === 'figuren' && <FigurePalette onAdd={handleAddFigure} />}
            {tab === 'ausgewaehlt' && selectedId && <FigureControls sessionId={session.id} />}
            {tab === 'ausgewaehlt' && !selectedId && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <p className="text-[11px] text-[#1F4045]/40">Figur auswählen um sie zu bearbeiten</p>
              </div>
            )}
            {tab === 'snapshots' && <SnapshotPanel sessionId={session.id} />}
            {tab === 'ki' && <AiPanel sessionTitle={session.title} />}
          </div>
        </div>

        {/* Board canvas */}
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="flex-1 relative overflow-auto"
            onClick={handleBoardClick}
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(210,180,140,0.15) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 80%, rgba(160,130,100,0.1) 0%, transparent 60%),
                linear-gradient(160deg, #e8d5b0 0%, #dcc890 40%, #d4b87a 100%)
              `,
            }}
          >
            {/* Wood grain texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    88deg,
                    transparent 0px,
                    transparent 18px,
                    rgba(139,90,43,0.025) 18px,
                    rgba(139,90,43,0.025) 19px
                  ),
                  repeating-linear-gradient(
                    92deg,
                    transparent 0px,
                    transparent 32px,
                    rgba(139,90,43,0.015) 32px,
                    rgba(139,90,43,0.015) 33px
                  )
                `,
              }}
            />

            {/* Board frame — oval/round */}
            <div className="absolute inset-10 pointer-events-none" style={{
              border: '3px solid rgba(139,90,43,0.18)',
              borderRadius: '48% 52% 50% 50% / 44% 44% 56% 56%',
              boxShadow: 'inset 0 2px 20px rgba(139,90,43,0.08), 0 0 0 1px rgba(255,255,255,0.3)',
            }} />

            <div className="min-w-[1200px] min-h-[800px] relative">
              {/* SVG connections layer */}
              <ConnectionsLayer />

              {/* Figures */}
              {figures.map((figure) => (
                <BoardFigure key={figure.id} figure={figure} />
              ))}

              {figures.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center space-y-3 opacity-30">
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mx-auto">
                      <circle cx="20" cy="18" r="9" stroke="#5C3D1E" strokeWidth="1.5" />
                      <circle cx="38" cy="30" r="9" stroke="#5C3D1E" strokeWidth="1.5" />
                      <line x1="28" y1="22" x2="32" y2="26" stroke="#5C3D1E" strokeWidth="1.5" strokeDasharray="3 2" />
                    </svg>
                    <p className="text-sm font-medium text-[#5C3D1E]">Systembrett ist leer</p>
                    <p className="text-xs text-[#5C3D1E]">Figuren aus der Palette hinzufügen</p>
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
