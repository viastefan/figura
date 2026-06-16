'use client'

import { useBoardStore } from '@/lib/store/board-store'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Figure, Shape } from '@/types/database'

const COLORS = ['#E8B4B8', '#A8C5DA', '#B5D5A7', '#F2D479', '#C4A6E0', '#F5C5A3']
const SHAPES: Shape[] = ['circle', 'square', 'triangle', 'diamond']

export function FigureControls({ sessionId }: { sessionId: string }) {
  const { figures, selectedId, updateFigure, removeFigure, selectFigure } =
    useBoardStore()
  const supabase = createClient()

  const figure = figures.find((f) => f.id === selectedId)
  if (!figure) return null

  async function handleUpdate(updates: Partial<Figure>) {
    if (!figure) return
    updateFigure(figure.id, updates)
    await supabase
      .from('figures')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', figure.id)
  }

  async function handleDelete() {
    if (!figure) return
    removeFigure(figure.id)
    selectFigure(null)
    await supabase.from('figures').delete().eq('id', figure.id)
  }

  function handleRotate(delta: number) {
    const newRotation = ((figure!.rotation + delta) % 360 + 360) % 360
    handleUpdate({ rotation: newRotation })
  }

  return (
    <div className="flex flex-col gap-3 p-3 bg-white/90 backdrop-blur rounded-lg border shadow-sm">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Ausgewählt
      </span>

      <Input
        value={figure.label}
        onChange={(e) => handleUpdate({ label: e.target.value })}
        placeholder="Label..."
        className="h-8 text-sm"
      />

      <div className="flex gap-1.5">
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => handleUpdate({ color })}
            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
              figure.color === color ? 'border-[#1F4045]' : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex gap-1.5">
        {SHAPES.map((shape) => (
          <button
            key={shape}
            onClick={() => handleUpdate({ shape })}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              figure.shape === shape
                ? 'bg-[#1F4045] text-white border-[#1F4045]'
                : 'border-border hover:bg-muted'
            }`}
          >
            {shape === 'circle'
              ? 'Kreis'
              : shape === 'square'
                ? 'Quadrat'
                : shape === 'triangle'
                  ? 'Dreieck'
                  : 'Raute'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Blickrichtung</span>
        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => handleRotate(-15)}>
          ↺
        </Button>
        <span className="text-xs tabular-nums w-8 text-center">{Math.round(figure.rotation)}°</span>
        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => handleRotate(15)}>
          ↻
        </Button>
      </div>

      <Button size="sm" variant="destructive" onClick={handleDelete} className="h-7 text-xs">
        Entfernen
      </Button>
    </div>
  )
}
