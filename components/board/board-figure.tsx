'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { FigureShape } from './figure-shape'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

export function BoardFigure({ figure }: { figure: Figure }) {
  const { selectedId, selectFigure } = useBoardStore()
  const isSelected = selectedId === figure.id

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: figure.id,
      data: figure,
    })

  const style: React.CSSProperties = {
    position: 'absolute',
    left: figure.x,
    top: figure.y,
    zIndex: isDragging ? 9999 : figure.z_index,
    transform: CSS.Translate.toString(transform),
    cursor: isDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation()
        selectFigure(figure.id)
      }}
      className="group flex flex-col items-center select-none"
    >
      <div
        className={`relative transition-shadow rounded-full ${
          isSelected ? 'ring-2 ring-[#C9A96E] ring-offset-2' : ''
        }`}
        style={{ transform: `rotate(${figure.rotation}deg)` }}
      >
        <FigureShape shape={figure.shape} color={figure.color} />
        {/* Direction arrow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <svg width="10" height="8" viewBox="0 0 10 8" className="text-[#1F4045]">
            <polygon points="5,0 10,8 0,8" fill="currentColor" />
          </svg>
        </div>
      </div>
      {figure.label && (
        <span className="mt-1 text-[10px] font-medium text-[#1F4045] max-w-[80px] truncate text-center leading-tight">
          {figure.label}
        </span>
      )}
    </div>
  )
}
