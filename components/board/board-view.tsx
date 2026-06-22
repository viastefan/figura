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
  const [sessionNote, setSessionNote] = useState('')
  const [showNote, setShowNote] = useState(false)

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
    const fig: Figure = {
      id: crypto.randomUUID(),
      session_id: session.id,
      shape: 'circle',
      color,
      label: '',
      x: 380 + (Math.random() - 0.5) * 160,
      y: 220 + (Math.random() - 0.5) * 100,
      rotation: 0,
      z_index: getMaxZIndex() + 1,
      updated_at: new Date().toISOString(),
    }
    addFigure(fig)
    selectFigure(fig.id)
    setTab('bearbeiten')
  }

  function handleBoardClick() {
    if (connectingFrom) { setConnectingFrom(null); return }
    selectFigure(null)
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'figuren', label: 'Figuren', icon: '⬡' },
    { id: 'bearbeiten', label: 'Bearbeiten', icon: '✎' },
    { id: 'verlauf', label: 'Verlauf', icon: '◎' },
    { id: 'ki', label: 'KI', icon: '✦' },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden" style={{ height: 'calc(100vh - 57px)' }}>

      {/* ── Top toolbar ── */}
      <div
        className="flex items-center gap-3 px-5 h-12 shrink-0 border-b"
        style={{ background: 'rgba(255,255,255,0.95)', borderColor: 'rgba(31,64,69,0.08)' }}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-[13px] text-[#1F4045]/50 hover:text-[#1F4045] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Übersicht
        </Link>
        <span style={{ color: 'rgba(31,64,69,0.15)' }}>|</span>
        <span className="text-[13px] font-semibold text-[#1F4045] flex-1 truncate">{session.title}</span>

        {/* Session note toggle */}
        <button
          onClick={() => setShowNote(!showNote)}
          className={[
            'flex items-center gap-1.5 text-[12px] px-3 h-7 rounded-full border transition-all',
            showNote || sessionNote
              ? 'bg-[#1F4045] text-white border-[#1F4045]'
              : 'border-[#1F4045]/15 text-[#1F4045]/50 hover:border-[#1F4045]/30 hover:text-[#1F4045]',
          ].join(' ')}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Notiz
        </button>

        {connectingFrom && (
          <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-3 h-7 flex items-center rounded-full">
            Ziel-Figur anklicken · ESC zum Abbrechen
          </span>
        )}

        <span className="text-[12px] text-[#1F4045]/35 tabular-nums">
          {figures.length} {figures.length === 1 ? 'Figur' : 'Figuren'}
        </span>
      </div>

      {/* Session note bar */}
      {showNote && (
        <div className="px-5 py-2 border-b flex items-center gap-3" style={{ background: '#fffdf8', borderColor: 'rgba(201,169,110,0.2)' }}>
          <span className="text-[11px] font-semibold text-[#1F4045]/40 shrink-0">Sitzungsnotiz</span>
          <input
            value={sessionNote}
            onChange={e => setSessionNote(e.target.value)}
            placeholder="Thema der Sitzung, Beobachtungen, nächste Schritte…"
            className="flex-1 text-[13px] text-[#1F4045] bg-transparent border-none outline-none placeholder:text-[#1F4045]/25"
            autoFocus
          />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <div
          className="w-64 flex flex-col shrink-0 border-r overflow-hidden"
          style={{ background: '#FAFAF8', borderColor: 'rgba(31,64,69,0.08)' }}
        >
          {/* Tab bar */}
          <div className="flex border-b" style={{ borderColor: 'rgba(31,64,69,0.08)' }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  'flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all border-b-2',
                  tab === t.id
                    ? 'border-[#C9A96E] text-[#1F4045]'
                    : 'border-transparent text-[#1F4045]/35 hover:text-[#1F4045]/60',
                ].join(' ')}
              >
                <span className="text-[13px]">{t.icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-wide">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {tab === 'figuren' && <FigurePalette onAdd={handleAddFigure} />}

            {tab === 'bearbeiten' && selectedId && <FigureControls sessionId={session.id} />}
            {tab === 'bearbeiten' && !selectedId && (
              <div className="flex flex-col items-center justify-center h-40 text-center gap-3">
                <svg width="40" height="47" viewBox="0 0 68 80" fill="none" opacity={0.18}>
                  <circle cx="34" cy="28" r="16" fill="#1F4045"/>
                  <path d="M12 58 C12 44 56 44 56 58 L56 72 C56 75 54 77 51 77 L17 77 C14 77 12 75 12 72 Z" fill="#1F4045"/>
                </svg>
                <p className="text-[12px] text-[#1F4045]/40 leading-relaxed">
                  Figur auf dem Brett<br/>anklicken
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
              background: [
                'radial-gradient(ellipse at 25% 30%, rgba(220,195,140,0.4) 0%, transparent 55%)',
                'radial-gradient(ellipse at 75% 70%, rgba(190,160,100,0.3) 0%, transparent 55%)',
                'linear-gradient(155deg, #ede0c4 0%, #dfc99a 50%, #d4b87a 100%)',
              ].join(', '),
            }}
          >
            {/* Wood grain texture */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: [
                'repeating-linear-gradient(89.5deg, transparent 0px, transparent 24px, rgba(90,50,15,0.018) 24px, rgba(90,50,15,0.018) 25px)',
                'repeating-linear-gradient(90.5deg, transparent 0px, transparent 40px, rgba(90,50,15,0.012) 40px, rgba(90,50,15,0.012) 41px)',
                'repeating-linear-gradient(89deg, transparent 0px, transparent 70px, rgba(90,50,15,0.008) 70px, rgba(90,50,15,0.008) 71px)',
              ].join(', '),
            }} />

            <div className="min-w-[1100px] min-h-[740px] relative">

              {/* Oval board boundary */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: '5%', left: '3%', right: '3%', bottom: '5%',
                  borderRadius: '50%',
                  border: '2px solid rgba(80,45,15,0.22)',
                  boxShadow: [
                    'inset 0 4px 40px rgba(80,45,15,0.06)',
                    'inset 0 -2px 12px rgba(80,45,15,0.04)',
                    '0 0 0 8px rgba(80,45,15,0.04)',
                  ].join(', '),
                }}
              />

              {/* Center mark */}
              <div
                className="absolute pointer-events-none flex flex-col items-center"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)' }}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="rgba(80,45,15,0.18)" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="16" cy="16" r="2.5" fill="rgba(80,45,15,0.2)" />
                </svg>
                <span className="text-[9px] font-semibold tracking-widest mt-0.5" style={{ color: 'rgba(80,45,15,0.25)' }}>
                  MITTE
                </span>
              </div>

              {/* Connections */}
              <ConnectionsLayer />

              {/* Figures */}
              {figures.map((fig) => (
                <BoardFigure key={fig.id} figure={fig} />
              ))}

              {/* Empty state */}
              {figures.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center" style={{ opacity: 0.22 }}>
                    <svg width="56" height="66" viewBox="0 0 68 80" fill="none" className="mx-auto mb-3">
                      <polygon points="34,2 40,14 28,14" fill="#5c3d1e" opacity="0.7" />
                      <circle cx="34" cy="28" r="16" fill="#5c3d1e" />
                      <path d="M12 58 C12 44 56 44 56 58 L56 72 C56 75 54 77 51 77 L17 77 C14 77 12 75 12 72 Z" fill="#5c3d1e" />
                    </svg>
                    <p className="text-[15px] font-semibold text-[#5c3d1e]">Brett ist leer</p>
                    <p className="text-[12px] text-[#5c3d1e] mt-1">Farbe links wählen → Figur erscheint hier</p>
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
