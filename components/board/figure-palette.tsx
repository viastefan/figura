'use client'

import { FigureShape } from './figure-shape'
import type { Shape } from '@/types/database'

const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'diamond']
const COLORS = ['#E8B4B8', '#A8C5DA', '#B5D5A7', '#F2D479', '#C4A6E0', '#F5C5A3']

export function FigurePalette({
  onAdd,
}: {
  onAdd: (shape: Shape, color: string) => void
}) {
  return (
    <div className="flex flex-col gap-3 p-3 bg-white/90 backdrop-blur rounded-lg border shadow-sm">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Figuren
      </span>
      <div className="grid grid-cols-4 gap-2">
        {SHAPES.map((shape) => (
          <button
            key={shape}
            onClick={() => onAdd(shape, COLORS[0])}
            className="flex items-center justify-center p-1.5 rounded hover:bg-muted transition-colors"
            title={shape}
          >
            <FigureShape shape={shape} color={COLORS[0]} size={32} />
          </button>
        ))}
      </div>
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Farben
      </span>
      <div className="flex gap-1.5">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onAdd('circle', color)}
            className="w-6 h-6 rounded-full border border-black/10 hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  )
}
