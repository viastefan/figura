'use client'

import { useBoardStore } from '@/lib/store/board-store'
import { Input } from '@/components/ui/input'
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

const ROTATION_PRESETS = [
  { label: 'N', deg: 0 },
  { label: 'NO', deg: 45 },
  { label: 'O', deg: 90 },
  { label: 'SO', deg: 135 },
  { label: 'S', deg: 180 },
  { label: 'SW', deg: 225 },
  { label: 'W', deg: 270 },
  { label: 'NW', deg: 315 },
]

export function FigureControls({ sessionId: _ }: { sessionId: string }) {
  const { figures, selectedId, updateFigure, removeFigure, selectFigure, connectingFrom, setConnectingFrom } =
    useBoardStore()

  const figure = figures.find((f) => f.id === selectedId)
  if (!figure) return null

  function up(updates: Partial<Figure>) {
    updateFigure(figure!.id, updates)
  }

  const isConnecting = connectingFrom === figure.id

  return (
    <div className="flex flex-col gap-4">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest">
          Name / Rolle
        </label>
        <Input
          value={figure.label}
          onChange={(e) => up({ label: e.target.value })}
          placeholder="z.B. Vater, Mutter, Ich…"
          className="h-9 text-sm bg-white/80 border-white/80"
          autoFocus
        />
      </div>

      {/* Farbe */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest">
          Bedeutung / Farbe
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {COLORS.map(({ hex, role }) => (
            <button
              key={hex}
              onClick={() => up({ color: hex })}
              title={role}
              className={[
                'w-full aspect-square rounded-full border-2 transition-all hover:scale-110',
                figure.color === hex
                  ? 'border-[#3d2b1a] scale-110 shadow-md'
                  : 'border-white/60 hover:border-white',
              ].join(' ')}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
        <p className="text-[10px] text-[#1F4045]/40">
          {COLORS.find(c => c.hex === figure.color)?.role ?? ''}
        </p>
      </div>

      {/* Blickrichtung */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest">
          Blickrichtung
        </label>
        <div className="grid grid-cols-4 gap-1">
          {ROTATION_PRESETS.map(({ label, deg }) => (
            <button
              key={label}
              onClick={() => up({ rotation: deg })}
              className={[
                'py-1.5 text-[11px] rounded-lg border transition-all',
                Math.abs(figure.rotation - deg) < 5
                  ? 'bg-[#1F4045] text-white border-[#1F4045]'
                  : 'bg-white/60 border-white/80 text-[#1F4045]/60 hover:bg-white/90',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => up({ rotation: ((figure.rotation - 15) + 360) % 360 })}
            className="flex-1 py-1.5 text-base rounded-lg bg-white/60 border border-white/80 hover:bg-white/90 transition-all text-[#1F4045]/60"
          >↺</button>
          <span className="text-[11px] tabular-nums text-[#1F4045]/50 w-10 text-center">{Math.round(figure.rotation)}°</span>
          <button
            onClick={() => up({ rotation: (figure.rotation + 15) % 360 })}
            className="flex-1 py-1.5 text-base rounded-lg bg-white/60 border border-white/80 hover:bg-white/90 transition-all text-[#1F4045]/60"
          >↻</button>
        </div>
      </div>

      {/* Verbinden */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest">
          Beziehung
        </label>
        <button
          onClick={() => setConnectingFrom(isConnecting ? null : figure.id)}
          className={[
            'w-full py-2 text-[12px] font-medium rounded-xl border transition-all',
            isConnecting
              ? 'bg-blue-500 text-white border-blue-500 shadow-md'
              : 'bg-white/60 border-white/80 text-[#1F4045]/70 hover:bg-white',
          ].join(' ')}
        >
          {isConnecting ? '→ Andere Figur anklicken' : 'Linie zu anderer Figur ziehen'}
        </button>
      </div>

      {/* Entfernen */}
      <button
        onClick={() => { removeFigure(figure.id); selectFigure(null) }}
        className="w-full py-2 text-[12px] rounded-xl bg-red-50 text-red-400 border border-red-100 hover:bg-red-100 transition-colors"
      >
        Figur entfernen
      </button>
    </div>
  )
}
