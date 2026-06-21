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
import type { Session, Figure } from '@/types/database'
import Link from 'next/link'

type Tab = 'figuren' | 'bearbeiten' | 'verlauf' | 'ki'

// "Ich"-marker — always in center, not draggable, just orientation
function IchMarker() {
  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none select-none"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#3d2b1a" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
        <circle cx="20" cy="20" r="3" fill="#3d2b1a" opacity="0.25" />
      </svg>
      <span className="text-[10px] font-medium text-[#3d2b1a]/40 mt-0.5 tracking-wide">Mitte</span>
    </div>
  )
}

export function BoardView({
  session,
  initialFigures,
  isOwner,
}: {
  session: Session
  initialFigures: Figure[]
  isOwner: boolean
}) {
  const {
    figures, setFigures, addFigure, updateFigure, selectFigure,
    getMaxZIndex, selectedId, connectingFrom, setConnectingFrom,
  } = useBoardStore()

  const [tab, setTab] = useState<Tab>('figuren')

  useEffect(() => { setFigures(initialFigures) }, [initialFigures, setFigures])
  useEffect(() => { if (selectedId) setTab('bearbeiten') }, [selectedId])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event
    const fig = figures.find((f) => f.id === active.id)
    if (!fig) return
    updateFigure(fig.id, {
      x: Math.max(0, fig.x + delta.x),
      y: Math.max(0, fig.y + delta.y),
      z_index: getMaxZIndex() + 1,
    })
  }, [figures, updateFigure, getMaxZIndex])

  function handleAddFigure(color: string) {
    // Always add as a person (circle = Mensch)
    const fig: Figure = {
      id: crypto.randomUUID(),
      session_id: session.id,
      shape: 'circle',
      color,
      label: '',
      x: 400 + (Math.random() - 0.5) * 200,
      y: 250 + (Math.random() - 0.5) * 120,
      rotation: 0,
      z_index: getMaxZIndex() + 1,
      updated_at: new Date().toISOString(),
    }
    addFigure(fig)
    selectFigure(fig.id)
    setTab('bearbeiten')
  }

  function handleBoardClick() {
    if (connectingFrom) {
      setConnectingFrom(null)
    } else {
      selectFigure(null)
    }
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'figuren', label: 'Figuren' },
    { id: 'bearbeiten', label: 'Bearbeiten' },
    { id: 'verlauf', label: 'Verlauf' },
    { id: 'ki', label: '✦ KI' },
  ]

  return (
    <div className="flex flex-1 flex-col" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-[#C9A96E]/20 px-5 h-11 bg-white/70 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-[#1F4045]/50 hover:text-[#1F4045] transition-colors flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Übersicht
          </Link>
          <span className="text-[#1F4045]/20">·</span>
          <span className="text-sm font-medium text-[#1F4045]">{session.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {connectingFrom && (
            <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              Ziel-Figur anklicken — oder Brett klicken zum Abbrechen
            </span>
          )}
          <span className="text-[11px] text-[#1F4045]/40 tabular-nums">
            {figures.length} {figures.length === 1 ? 'Figur' : 'Figuren'}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ── */}
        <div
          className="w-56 flex flex-col border-r border-[#C9A96E]/20 shrink-0"
          style={{ background: 'rgba(250,246,238,0.95)', backdropFilter: 'blur(12px)' }}
        >
          {/* Tabs */}
          <div className="flex border-b border-[#C9A96E]/20">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'flex-1 py-2.5 text-[10px] font-semibold transition-all',
                  tab === t.id
                    ? 'text-[#1F4045] border-b-2 border-[#C9A96E]'
                    : 'text-[#1F4045]/35 hover:text-[#1F4045]/60',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {tab === 'figuren' && (
              <FigurePalette onAdd={handleAddFigure} />
            )}
            {tab === 'bearbeiten' && selectedId && (
              <FigureControls sessionId={session.id} />
            )}
            {tab === 'bearbeiten' && !selectedId && (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
                <svg width="32" height="32" viewBox="0 0 56 64" fill="none" className="opacity-20">
                  <circle cx="28" cy="23" r="10" fill="#3d2b1a"/>
                  <path d="M14 48 C14 37 42 37 42 48 L42 58 C42 61 40 63 37 63 L19 63 C16 63 14 61 14 58 Z" fill="#3d2b1a"/>
                </svg>
                <p className="text-[11px] text-[#1F4045]/40 leading-relaxed">
                  Figur auf dem Brett anklicken um sie zu bearbeiten
                </p>
              </div>
            )}
            {tab === 'verlauf' && <SnapshotPanel sessionId={session.id} />}
            {tab === 'ki' && <AiPanel sessionTitle={session.title} />}
          </div>
        </div>

        {/* ── Board Canvas ── */}
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            className="flex-1 relative overflow-auto"
            onClick={handleBoardClick}
            style={{
              background: 'linear-gradient(160deg, #ede0c4 0%, #e2cc9a 45%, #d8bc80 100%)',
            }}
          >
            {/* Wood grain */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: [
                'repeating-linear-gradient(89deg, transparent 0px, transparent 22px, rgba(100,60,20,0.022) 22px, rgba(100,60,20,0.022) 23px)',
                'repeating-linear-gradient(91deg, transparent 0px, transparent 38px, rgba(100,60,20,0.015) 38px, rgba(100,60,20,0.015) 39px)',
              ].join(', '),
            }} />

            <div className="min-w-[1100px] min-h-[750px] relative">
              {/* Oval board frame */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '6%', left: '4%', right: '4%', bottom: '6%',
                  border: '2px solid rgba(80,45,15,0.2)',
                  borderRadius: '50%',
                  boxShadow: 'inset 0 3px 30px rgba(80,45,15,0.06), inset 0 -2px 10px rgba(80,45,15,0.04)',
                }}
              />

              {/* Subtle center marker */}
              <IchMarker />

              {/* SVG connections */}
              <ConnectionsLayer />

              {/* Figures */}
              {figures.map((fig) => (
                <BoardFigure key={fig.id} figure={fig} />
              ))}

              {/* Empty state */}
              {figures.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center space-y-2 opacity-25">
                    <svg width="52" height="60" viewBox="0 0 56 64" fill="none" className="mx-auto">
                      <polygon points="28,1 34,11 22,11" fill="#3d2b1a" opacity="0.65"/>
                      <circle cx="28" cy="23" r="10" fill="#3d2b1a"/>
                      <path d="M14 48 C14 37 42 37 42 48 L42 58 C42 61 40 63 37 63 L19 63 C16 63 14 61 14 58 Z" fill="#3d2b1a"/>
                    </svg>
                    <p className="text-sm font-medium text-[#3d2b1a]">Noch keine Figuren</p>
                    <p className="text-xs text-[#3d2b1a]">Links eine Farbe wählen um zu beginnen</p>
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
