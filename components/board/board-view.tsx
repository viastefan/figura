'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { DndContext, type DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useBoardStore } from '@/lib/store/board-store'
import { BoardFigure } from './board-figure'
import { FigurePalette } from './figure-palette'
import { FigureControls } from './figure-controls'
import { ConnectionControls } from './connection-controls'
import { SnapshotPanel } from './snapshot-panel'
import { ConnectionsLayer } from './connections-layer'
import { AiPanel } from './ai-panel'
import type { Session, Figure } from '@/types/database'
import Link from 'next/link'

type Tab = 'figuren' | 'bearbeiten' | 'verbindung' | 'verlauf' | 'ki'

export function BoardView({ session, initialFigures, isOwner }: {
  session: Session; initialFigures: Figure[]; isOwner: boolean
}) {
  const {
    figures, setFigures, addFigure, updateFigure, selectFigure,
    getMaxZIndex, selectedId, connectingFrom, setConnectingFrom,
    selectedConnectionId, selectConnection,
    sessionNote, setSessionNote, clearBoard,
    connections,
  } = useBoardStore()

  const [tab, setTab] = useState<Tab>('figuren')
  const [showNote, setShowNote] = useState(false)
  const [showClientLink, setShowClientLink] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const boardRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setFigures(initialFigures) }, [initialFigures, setFigures])
  useEffect(() => { if (selectedId) setTab('bearbeiten') }, [selectedId])
  useEffect(() => { if (selectedConnectionId) setTab('verbindung') }, [selectedConnectionId])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } })
  )

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
      x: 380 + (Math.random() - 0.5) * 200,
      y: 220 + (Math.random() - 0.5) * 120,
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
    selectConnection(null)
  }

  async function handleExportPNG() {
    if (!boardRef.current) return
    const canvas = document.createElement('canvas')
    const rect = boardRef.current.getBoundingClientRect()
    canvas.width = 1400
    canvas.height = 900
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#dfc99a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    ctx.ellipse(700, 450, 580, 370, 0, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(80,45,15,0.3)'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fillStyle = 'rgba(80,45,15,0.07)'
    ctx.fill()

    // Draw connections
    const scaleX = canvas.width / (boardRef.current.scrollWidth || 1100)
    const scaleY = canvas.height / (boardRef.current.scrollHeight || 740)
    connections.forEach(conn => {
      const from = figures.find(f => f.id === conn.fromId)
      const to = figures.find(f => f.id === conn.toId)
      if (!from || !to) return
      ctx.beginPath()
      ctx.moveTo((from.x + 32) * scaleX, (from.y + 40) * scaleY)
      ctx.lineTo((to.x + 32) * scaleX, (to.y + 40) * scaleY)
      ctx.strokeStyle = conn.color
      ctx.lineWidth = 2
      if (conn.style === 'dashed') ctx.setLineDash([8, 5])
      else ctx.setLineDash([])
      ctx.stroke()
      ctx.setLineDash([])
    })

    // Draw figures
    figures.forEach(fig => {
      const cx = (fig.x + 32) * scaleX
      const cy = (fig.y + 40) * scaleY
      const r = 20
      ctx.beginPath()
      ctx.arc(cx, cy - 8, r * 0.55, 0, Math.PI * 2)
      ctx.fillStyle = fig.color
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx, cy + 12, r * 0.7, r * 0.6, 0, 0, Math.PI)
      ctx.fill()
      if (fig.label) {
        ctx.fillStyle = '#2d1a0e'
        ctx.font = 'bold 13px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(fig.label, cx, cy + 32)
      }
    })

    // Watermark
    ctx.fillStyle = 'rgba(31,64,69,0.25)'
    ctx.font = '14px system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('Figura · ' + new Date().toLocaleDateString('de-DE'), canvas.width - 20, canvas.height - 16)

    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${session.title.replace(/[^a-z0-9]/gi, '-')}-aufstellung.png`
    a.click()
  }

  function copyClientLink() {
    const link = `${window.location.origin}/session/${session.id}?klient=1`
    navigator.clipboard.writeText(link).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  const TABS: { id: Tab; icon: string; label: string }[] = [
    { id: 'figuren', icon: '⬡', label: 'Figuren' },
    { id: 'bearbeiten', icon: '✎', label: 'Bearbeiten' },
    { id: 'verbindung', icon: '—', label: 'Verbindung' },
    { id: 'verlauf', icon: '◎', label: 'Verlauf' },
    { id: 'ki', icon: '✦', label: 'KI' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', height: 48,
        background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid rgba(31,64,69,0.08)',
        flexShrink: 0, flexWrap: 'wrap',
      }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'rgba(31,64,69,0.5)', textDecoration: 'none' }}
          className="hover:text-[#1F4045] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Übersicht
        </Link>
        <span style={{ color: 'rgba(31,64,69,0.15)', fontSize: 18 }}>|</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1F4045', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {session.title}
        </span>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {connectingFrom && (
            <span style={{ fontSize: 11, color: '#3b82f6', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '3px 10px', borderRadius: 100 }}>
              Ziel anklicken · ESC abbr.
            </span>
          )}

          {/* Note toggle */}
          <button onClick={() => setShowNote(!showNote)} title="Sitzungsnotiz"
            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${showNote || sessionNote ? '#1F4045' : 'rgba(31,64,69,0.15)'}`, background: showNote || sessionNote ? '#1F4045' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4z" stroke={showNote || sessionNote ? 'white' : '#1F4045'} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Client link */}
          <button onClick={() => setShowClientLink(!showClientLink)} title="Klienten-Link"
            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${showClientLink ? '#1F4045' : 'rgba(31,64,69,0.15)'}`, background: showClientLink ? '#1F4045' : 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke={showClientLink ? 'white' : '#1F4045'} strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke={showClientLink ? 'white' : '#1F4045'} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Export */}
          <button onClick={handleExportPNG} title="Als Bild exportieren"
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(31,64,69,0.15)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="#1F4045" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Clear */}
          <button onClick={() => setShowClearConfirm(true)} title="Brett leeren"
            style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <span style={{ fontSize: 12, color: 'rgba(31,64,69,0.35)', whiteSpace: 'nowrap' }}>
            {figures.length} {figures.length === 1 ? 'Figur' : 'Figuren'}
          </span>
        </div>
      </div>

      {/* Notification bars */}
      {showNote && (
        <div style={{ padding: '8px 20px', background: '#fffdf8', borderBottom: '1px solid rgba(201,169,110,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(31,64,69,0.4)', whiteSpace: 'nowrap' }}>NOTIZ</span>
          <input value={sessionNote} onChange={e => setSessionNote(e.target.value)}
            placeholder="Thema, Beobachtungen, nächste Schritte…" autoFocus
            style={{ flex: 1, fontSize: 13, color: '#1F4045', background: 'transparent', border: 'none', outline: 'none' }} />
          <button onClick={() => setShowNote(false)} style={{ fontSize: 16, color: 'rgba(31,64,69,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {showClientLink && (
        <div style={{ padding: '10px 20px', background: '#f0fdf4', borderBottom: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 12, color: '#15803d', flex: 1 }}>
            Klienten-Link: <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: 4, fontSize: 11 }}>
              {typeof window !== 'undefined' ? `${window.location.origin}/session/${session.id}` : ''}
            </code>
          </span>
          <button onClick={copyClientLink} style={{
            padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: linkCopied ? '#16a34a' : 'white', color: linkCopied ? 'white' : '#16a34a',
            border: '1px solid rgba(34,197,94,0.4)', cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {linkCopied ? '✓ Kopiert' : 'Kopieren'}
          </button>
          <button onClick={() => setShowClientLink(false)} style={{ fontSize: 16, color: 'rgba(0,0,0,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {showClearConfirm && (
        <div style={{ padding: '10px 20px', background: '#fef2f2', borderBottom: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#b91c1c', flex: 1 }}>Brett leeren? Alle Figuren und Verbindungen werden entfernt.</span>
          <button onClick={() => { clearBoard(); setShowClearConfirm(false) }} style={{ padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}>Leeren</button>
          <button onClick={() => setShowClearConfirm(false)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 12, color: 'rgba(31,64,69,0.5)', border: '1px solid rgba(31,64,69,0.1)', background: 'white', cursor: 'pointer' }}>Abbrechen</button>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 256, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: '1px solid rgba(31,64,69,0.08)', background: '#FAFAF8', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(31,64,69,0.08)', flexShrink: 0 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '8px 2px', gap: 2,
                borderBottom: tab === t.id ? '2px solid #C9A96E' : '2px solid transparent',
                color: tab === t.id ? '#1F4045' : 'rgba(31,64,69,0.35)',
                background: 'none', border: 'none',
                cursor: 'pointer', transition: 'all 0.1s',
              }}>
                <span style={{ fontSize: 13 }}>{t.icon}</span>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.label}</span>
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {tab === 'figuren' && <FigurePalette onAdd={handleAddFigure} />}
            {tab === 'bearbeiten' && selectedId && <FigureControls sessionId={session.id} />}
            {tab === 'bearbeiten' && !selectedId && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, textAlign: 'center', gap: 12 }}>
                <svg width="40" height="47" viewBox="0 0 68 80" fill="none" opacity={0.15}>
                  <circle cx="34" cy="24" r="14" fill="#1F4045"/>
                  <path d="M10 62 C10 46 58 46 58 62 L58 74 C58 77 56 79 53 79 L15 79 C12 79 10 77 10 74 Z" fill="#1F4045"/>
                </svg>
                <p style={{ fontSize: 12, color: 'rgba(31,64,69,0.4)', lineHeight: 1.5 }}>Figur auf dem Brett<br/>anklicken</p>
              </div>
            )}
            {tab === 'verbindung' && selectedConnectionId && <ConnectionControls />}
            {tab === 'verbindung' && !selectedConnectionId && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 160, textAlign: 'center', gap: 12 }}>
                <svg width="40" height="12" viewBox="0 0 40 12">
                  <line x1="2" y1="6" x2="38" y2="6" stroke="#1F4045" strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round" opacity="0.25"/>
                </svg>
                <p style={{ fontSize: 12, color: 'rgba(31,64,69,0.4)', lineHeight: 1.5 }}>Verbindungslinie<br/>anklicken</p>
              </div>
            )}
            {tab === 'verlauf' && <SnapshotPanel sessionId={session.id} />}
            {tab === 'ki' && <AiPanel sessionTitle={session.title} />}
          </div>
        </div>

        {/* Board Canvas */}
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            ref={boardRef}
            onClick={handleBoardClick}
            style={{
              flex: 1, position: 'relative', overflow: 'auto',
              background: [
                'radial-gradient(ellipse at 25% 30%, rgba(220,195,140,0.45) 0%, transparent 55%)',
                'radial-gradient(ellipse at 75% 70%, rgba(190,160,100,0.3) 0%, transparent 55%)',
                'linear-gradient(155deg, #ede0c4 0%, #dfc99a 50%, #d4b87a 100%)',
              ].join(', '),
            }}
          >
            {/* Wood grain */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: [
              'repeating-linear-gradient(89.5deg, transparent 0px, transparent 24px, rgba(90,50,15,0.018) 24px, rgba(90,50,15,0.018) 25px)',
              'repeating-linear-gradient(90.5deg, transparent 0px, transparent 42px, rgba(90,50,15,0.012) 42px, rgba(90,50,15,0.012) 43px)',
            ].join(', ')}} />

            <div style={{ minWidth: 1100, minHeight: 740, position: 'relative' }}>
              {/* Oval frame */}
              <div style={{
                position: 'absolute', top: '5%', left: '3%', right: '3%', bottom: '5%',
                borderRadius: '50%',
                border: '2px solid rgba(80,45,15,0.22)',
                boxShadow: 'inset 0 4px 40px rgba(80,45,15,0.06), inset 0 -2px 12px rgba(80,45,15,0.04), 0 0 0 8px rgba(80,45,15,0.03)',
                pointerEvents: 'none',
              }} />

              {/* Center mark */}
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" stroke="rgba(80,45,15,0.18)" strokeWidth="1" strokeDasharray="3 3"/>
                  <circle cx="16" cy="16" r="2.5" fill="rgba(80,45,15,0.2)"/>
                </svg>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(80,45,15,0.25)', marginTop: 2 }}>MITTE</span>
              </div>

              <ConnectionsLayer />
              {figures.map(fig => <BoardFigure key={fig.id} figure={fig} />)}

              {figures.length === 0 && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                  <div style={{ textAlign: 'center', opacity: 0.2 }}>
                    <svg width="56" height="66" viewBox="0 0 68 80" fill="none" style={{ margin: '0 auto 12px' }}>
                      <polygon points="34,2 40,14 28,14" fill="#5c3d1e" opacity="0.7"/>
                      <circle cx="34" cy="28" r="16" fill="#5c3d1e"/>
                      <path d="M12 58 C12 44 56 44 56 58 L56 72 C56 75 54 77 51 77 L17 77 C14 77 12 75 12 72 Z" fill="#5c3d1e"/>
                    </svg>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#5c3d1e' }}>Brett ist leer</p>
                    <p style={{ fontSize: 12, color: '#5c3d1e', marginTop: 4 }}>Links Farbe wählen → Figur erscheint hier</p>
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
