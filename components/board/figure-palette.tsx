'use client'

import { FigureShape } from './figure-shape'
import type { Shape } from '@/types/database'

const SHAPES: { shape: Shape; label: string }[] = [
  { shape: 'circle', label: 'Person' },
  { shape: 'square', label: 'Gruppe' },
  { shape: 'triangle', label: 'Kraft' },
  { shape: 'diamond', label: 'Idee' },
]

const COLORS: { hex: string; label: string }[] = [
  { hex: '#E8B4B8', label: 'Rosa — Fürsorge' },
  { hex: '#A8C5DA', label: 'Blau — Ruhe' },
  { hex: '#B5D5A7', label: 'Grün — Wachstum' },
  { hex: '#F2D479', label: 'Gelb — Energie' },
  { hex: '#C4A6E0', label: 'Lila — Intuition' },
  { hex: '#F5C5A3', label: 'Orange — Wärme' },
  { hex: '#94A3B8', label: 'Grau — Distanz' },
  { hex: '#F87171', label: 'Rot — Konflikt' },
]

export function FigurePalette({
  onAdd,
}: {
  onAdd: (shape: Shape, color: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest px-1">
          Figuren
        </span>
        <div className="grid grid-cols-2 gap-1.5">
          {SHAPES.map(({ shape, label }) => (
            <button
              key={shape}
              onClick={() => onAdd(shape, COLORS[0].hex)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/60 hover:bg-white/90 border border-white/80 hover:border-[#C9A96E]/40 transition-all hover:shadow-sm group"
              title={label}
            >
              <FigureShape shape={shape} color={COLORS[0].hex} size={36} />
              <span className="text-[9px] font-medium text-[#1F4045]/60 group-hover:text-[#1F4045]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest px-1">
          Farben & Bedeutung
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {COLORS.map(({ hex, label }) => (
            <button
              key={hex}
              onClick={() => onAdd('circle', hex)}
              className="flex flex-col items-center gap-1 group"
              title={label}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform hover:shadow-md"
                style={{ backgroundColor: hex }}
              />
              <span className="text-[8px] text-[#1F4045]/40 group-hover:text-[#1F4045]/70 text-center leading-tight max-w-[40px]">
                {label.split(' — ')[1]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
