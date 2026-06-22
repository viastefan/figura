'use client'

import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

const COLORS: { hex: string; role: string }[] = [
  { hex: '#E8B4B8', role: 'Fürsorge' },
  { hex: '#A8C5DA', role: 'Ruhe' },
  { hex: '#B5D5A7', role: 'Wachstum' },
  { hex: '#F2D479', role: 'Energie' },
  { hex: '#C4A6E0', role: 'Intuition' },
  { hex: '#F5C5A3', role: 'Wärme' },
  { hex: '#94A3B8', role: 'Distanz' },
  { hex: '#F87171', role: 'Konflikt' },
  { hex: '#6B8F71', role: 'Stabilität' },
  { hex: '#D4A5A5', role: 'Verlust' },
]

const COMPASS = [
  { label: 'N', deg: 0 },   { label: 'NO', deg: 45 },
  { label: 'O', deg: 90 },  { label: 'SO', deg: 135 },
  { label: 'S', deg: 180 }, { label: 'SW', deg: 225 },
  { label: 'W', deg: 270 }, { label: 'NW', deg: 315 },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#1F4045]/40 mb-2">
      {children}
    </p>
  )
}

function Divider() {
  return <div className="h-px bg-[#1F4045]/8 my-4" />
}

export function FigureControls({ sessionId: _ }: { sessionId: string }) {
  const { figures, selectedId, updateFigure, removeFigure, selectFigure, connectingFrom, setConnectingFrom } =
    useBoardStore()

  const figure = figures.find((f) => f.id === selectedId)
  if (!figure) return null

  function up(updates: Partial<Figure>) {
    updateFigure(figure!.id, updates)
  }

  const isConnecting = connectingFrom === figure.id
  const currentColorRole = COLORS.find(c => c.hex === figure.color)?.role ?? ''
  const nearestCompass = COMPASS.reduce((prev, curr) =>
    Math.abs(curr.deg - figure.rotation) < Math.abs(prev.deg - figure.rotation) ? curr : prev
  )

  return (
    <div className="flex flex-col">
      {/* Name */}
      <SectionLabel>Name / Rolle</SectionLabel>
      <input
        value={figure.label}
        onChange={(e) => up({ label: e.target.value })}
        placeholder="z.B. Vater, Mutter, Ich…"
        autoFocus
        className="w-full h-10 px-3 text-[14px] rounded-xl border border-[#1F4045]/15 bg-white placeholder:text-[#1F4045]/30 text-[#1F4045] focus:outline-none focus:border-[#C9A96E] transition-colors"
      />

      <Divider />

      {/* Farbe / Bedeutung */}
      <SectionLabel>Bedeutung</SectionLabel>
      {currentColorRole && (
        <div
          className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
          style={{ background: `${figure.color}33`, border: `1px solid ${figure.color}66` }}
        >
          <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: figure.color }} />
          <span className="text-[13px] font-semibold text-[#1F4045]">{currentColorRole}</span>
        </div>
      )}
      <div className="grid grid-cols-5 gap-2">
        {COLORS.map(({ hex, role }) => (
          <button
            key={hex}
            title={role}
            onClick={() => up({ color: hex })}
            className="group relative"
          >
            <div
              className={[
                'w-full aspect-square rounded-full border-2 transition-all',
                figure.color === hex
                  ? 'scale-110 border-[#1F4045]'
                  : 'border-transparent hover:border-white hover:scale-105',
              ].join(' ')}
              style={{ backgroundColor: hex, boxShadow: figure.color === hex ? '0 0 0 2px #1F4045' : `0 2px 6px ${hex}66` }}
            />
          </button>
        ))}
      </div>

      <Divider />

      {/* Blickrichtung */}
      <SectionLabel>Blickrichtung</SectionLabel>
      <div
        className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[#1F4045]/5"
      >
        <span className="text-lg">↑</span>
        <span className="text-[13px] font-semibold text-[#1F4045]">{nearestCompass.label}</span>
        <span className="text-[12px] text-[#1F4045]/40">({Math.round(figure.rotation)}°)</span>
      </div>

      {/* Compass grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-2">
        {/* Row 1: NW, N, NO */}
        {['NW', 'N', 'NO'].map(label => {
          const c = COMPASS.find(x => x.label === label)!
          const isActive = Math.abs(figure.rotation - c.deg) < 23
          return (
            <button
              key={label}
              onClick={() => up({ rotation: c.deg })}
              className={[
                'py-2 text-[12px] font-semibold rounded-lg border transition-all',
                isActive
                  ? 'bg-[#1F4045] text-white border-[#1F4045]'
                  : 'bg-white border-[#1F4045]/12 text-[#1F4045]/60 hover:border-[#1F4045]/30 hover:text-[#1F4045]',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
        {/* Row 2: W, center, O */}
        {['W', null, 'O'].map((label, i) => {
          if (!label) return (
            <div key={i} className="flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1F4045]/20" />
            </div>
          )
          const c = COMPASS.find(x => x.label === label)!
          const isActive = Math.abs((figure.rotation - c.deg + 360) % 360) < 23
          return (
            <button
              key={label}
              onClick={() => up({ rotation: c.deg })}
              className={[
                'py-2 text-[12px] font-semibold rounded-lg border transition-all',
                isActive
                  ? 'bg-[#1F4045] text-white border-[#1F4045]'
                  : 'bg-white border-[#1F4045]/12 text-[#1F4045]/60 hover:border-[#1F4045]/30 hover:text-[#1F4045]',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
        {/* Row 3: SW, S, SO */}
        {['SW', 'S', 'SO'].map(label => {
          const c = COMPASS.find(x => x.label === label)!
          const isActive = Math.abs((figure.rotation - c.deg + 360) % 360) < 23
          return (
            <button
              key={label}
              onClick={() => up({ rotation: c.deg })}
              className={[
                'py-2 text-[12px] font-semibold rounded-lg border transition-all',
                isActive
                  ? 'bg-[#1F4045] text-white border-[#1F4045]'
                  : 'bg-white border-[#1F4045]/12 text-[#1F4045]/60 hover:border-[#1F4045]/30 hover:text-[#1F4045]',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>
      {/* Fine-tune */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => up({ rotation: ((figure.rotation - 5) + 360) % 360 })}
          className="flex-1 h-8 rounded-lg border border-[#1F4045]/12 bg-white text-[#1F4045]/60 hover:text-[#1F4045] text-base transition-colors"
        >↺</button>
        <span className="text-[11px] text-[#1F4045]/40 tabular-nums w-8 text-center">5°</span>
        <button
          onClick={() => up({ rotation: (figure.rotation + 5) % 360 })}
          className="flex-1 h-8 rounded-lg border border-[#1F4045]/12 bg-white text-[#1F4045]/60 hover:text-[#1F4045] text-base transition-colors"
        >↻</button>
      </div>

      <Divider />

      {/* Beziehung */}
      <SectionLabel>Beziehung</SectionLabel>
      <button
        onClick={() => setConnectingFrom(isConnecting ? null : figure.id)}
        className={[
          'w-full h-10 rounded-xl text-[13px] font-semibold border transition-all',
          isConnecting
            ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/25'
            : 'bg-white border-[#1F4045]/15 text-[#1F4045] hover:border-[#1F4045]/30',
        ].join(' ')}
      >
        {isConnecting ? '→ Andere Figur anklicken' : 'Verbindungslinie ziehen'}
      </button>

      <Divider />

      {/* Löschen */}
      <button
        onClick={() => { removeFigure(figure.id); selectFigure(null) }}
        className="w-full h-9 rounded-xl text-[13px] text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 transition-colors"
      >
        Figur entfernen
      </button>
    </div>
  )
}
