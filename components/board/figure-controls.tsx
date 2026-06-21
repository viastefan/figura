'use client'

import { useBoardStore } from '@/lib/store/board-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Figure, Shape } from '@/types/database'

const COLORS = [
  { hex: '#E8B4B8', label: 'Fürsorge' },
  { hex: '#A8C5DA', label: 'Ruhe' },
  { hex: '#B5D5A7', label: 'Wachstum' },
  { hex: '#F2D479', label: 'Energie' },
  { hex: '#C4A6E0', label: 'Intuition' },
  { hex: '#F5C5A3', label: 'Wärme' },
  { hex: '#94A3B8', label: 'Distanz' },
  { hex: '#F87171', label: 'Konflikt' },
]

const SHAPES: { shape: Shape; label: string }[] = [
  { shape: 'circle', label: 'Person' },
  { shape: 'square', label: 'Gruppe' },
  { shape: 'triangle', label: 'Kraft' },
  { shape: 'diamond', label: 'Idee' },
]

export function FigureControls({ sessionId: _ }: { sessionId: string }) {
  const { figures, selectedId, updateFigure, removeFigure, selectFigure, connectingFrom, setConnectingFrom } =
    useBoardStore()

  const figure = figures.find((f) => f.id === selectedId)
  if (!figure) return null

  function handleUpdate(updates: Partial<Figure>) {
    if (!figure) return
    updateFigure(figure.id, updates)
  }

  function handleDelete() {
    if (!figure) return
    removeFigure(figure.id)
    selectFigure(null)
  }

  function handleRotate(delta: number) {
    const newRotation = ((figure!.rotation + delta) % 360 + 360) % 360
    handleUpdate({ rotation: newRotation })
  }

  const isConnecting = connectingFrom === figure.id

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest px-1">
        Ausgewählt
      </span>

      {/* Label */}
      <Input
        value={figure.label}
        onChange={(e) => handleUpdate({ label: e.target.value })}
        placeholder="Name oder Rolle..."
        className="h-8 text-sm bg-white/70 border-white/80 focus:bg-white"
      />

      {/* Color */}
      <div className="grid grid-cols-4 gap-1.5">
        {COLORS.map(({ hex, label }) => (
          <button
            key={hex}
            onClick={() => handleUpdate({ color: hex })}
            title={label}
            className={`w-full aspect-square rounded-full border-2 transition-all hover:scale-110 ${
              figure.color === hex
                ? 'border-[#1F4045] scale-110 shadow-md'
                : 'border-transparent hover:border-white'
            }`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>

      {/* Shape */}
      <div className="grid grid-cols-2 gap-1">
        {SHAPES.map(({ shape, label }) => (
          <button
            key={shape}
            onClick={() => handleUpdate({ shape })}
            className={`px-2 py-1.5 text-[11px] rounded-lg border transition-all ${
              figure.shape === shape
                ? 'bg-[#1F4045] text-white border-[#1F4045]'
                : 'bg-white/60 border-white/80 text-[#1F4045]/70 hover:bg-white/90'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Rotation */}
      <div className="flex items-center gap-1.5 bg-white/60 rounded-lg px-2 py-1.5">
        <span className="text-[10px] text-[#1F4045]/50 flex-1">Blickrichtung</span>
        <button
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-[#1F4045]/60 hover:text-[#1F4045] text-base"
          onClick={() => handleRotate(-15)}
        >↺</button>
        <span className="text-[11px] tabular-nums w-8 text-center text-[#1F4045]/70">{Math.round(figure.rotation)}°</span>
        <button
          className="w-6 h-6 rounded flex items-center justify-center hover:bg-white text-[#1F4045]/60 hover:text-[#1F4045] text-base"
          onClick={() => handleRotate(15)}
        >↻</button>
      </div>

      {/* Connect button */}
      <button
        onClick={() => setConnectingFrom(isConnecting ? null : figure.id)}
        className={`w-full py-1.5 text-[11px] rounded-lg border transition-all ${
          isConnecting
            ? 'bg-blue-500 text-white border-blue-500'
            : 'bg-white/60 border-white/80 text-[#1F4045]/70 hover:bg-white/90'
        }`}
      >
        {isConnecting ? '→ Verbindung herstellen…' : 'Verbinden'}
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="w-full py-1.5 text-[11px] rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-100 transition-colors"
      >
        Entfernen
      </button>
    </div>
  )
}
