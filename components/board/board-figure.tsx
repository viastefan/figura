'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

const COLOR_LABELS: Record<string, string> = {
  '#E8B4B8': 'Fürsorge',
  '#A8C5DA': 'Ruhe',
  '#B5D5A7': 'Wachstum',
  '#F2D479': 'Energie',
  '#C4A6E0': 'Intuition',
  '#F5C5A3': 'Wärme',
  '#94A3B8': 'Distanz',
  '#F87171': 'Konflikt',
  '#6B8F71': 'Stabilität',
  '#D4A5A5': 'Verlust',
}

function PersonSVG({ color, size = 68 }: { color: string; size?: number }) {
  // viewBox 0 0 68 80 — head top at y=8, body bottom at y=78
  const scale = size / 68
  const w = 68 * scale
  const h = 80 * scale
  return (
    <svg width={w} height={h} viewBox="0 0 68 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow under figure */}
      <ellipse cx="34" cy="77" rx="18" ry="4" fill="rgba(0,0,0,0.10)" />
      {/* Body */}
      <path
        d="M12 58 C12 44 56 44 56 58 L56 72 C56 75 54 77 51 77 L17 77 C14 77 12 75 12 72 Z"
        fill={color}
      />
      {/* Body shadow bottom */}
      <path
        d="M12 68 C12 58 56 58 56 68 L56 72 C56 75 54 77 51 77 L17 77 C14 77 12 75 12 72 Z"
        fill="rgba(0,0,0,0.08)"
      />
      {/* Neck */}
      <rect x="29" y="38" width="10" height="10" rx="3" fill={color} />
      {/* Head */}
      <circle cx="34" cy="28" r="16" fill={color} />
      {/* Head highlight */}
      <ellipse cx="29" cy="22" rx="6" ry="5" fill="white" opacity="0.2" />
      {/* Head border */}
      <circle cx="34" cy="28" r="16" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
      {/* Direction arrow — points UP = where figure is looking */}
      <polygon points="34,2 40,14 28,14" fill="rgba(50,30,10,0.7)" />
    </svg>
  )
}

export function BoardFigure({ figure }: { figure: Figure }) {
  const {
    selectedId, selectFigure,
    connectingFrom, setConnectingFrom, addConnection, connections,
    getMaxZIndex, updateFigure,
  } = useBoardStore()

  const isSelected = selectedId === figure.id
  const isConnectingMode = connectingFrom !== null
  const isConnectingFrom = connectingFrom === figure.id
  const isAlreadyConnected = connections.some(
    (c) => (c.fromId === connectingFrom && c.toId === figure.id) || (c.toId === connectingFrom && c.fromId === figure.id)
  )

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: figure.id,
    data: figure,
  })

  const style: React.CSSProperties = {
    position: 'absolute',
    left: figure.x,
    top: figure.y,
    zIndex: isDragging ? 9999 : figure.z_index,
    transform: CSS.Translate.toString(transform),
    touchAction: 'none',
    cursor: isDragging
      ? 'grabbing'
      : isConnectingMode && !isConnectingFrom
      ? 'crosshair'
      : 'grab',
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (isConnectingMode && !isConnectingFrom) {
      if (!isAlreadyConnected && connectingFrom) {
        addConnection({
          id: crypto.randomUUID(),
          fromId: connectingFrom,
          toId: figure.id,
          style: 'solid',
          color: '#5c3d1e',
        })
      }
      setConnectingFrom(null)
    } else {
      selectFigure(figure.id)
      updateFigure(figure.id, { z_index: getMaxZIndex() + 1 })
    }
  }

  const colorLabel = COLOR_LABELS[figure.color] ?? ''

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isConnectingMode && !isConnectingFrom ? {} : listeners)}
      {...attributes}
      onClick={handleClick}
      className="flex flex-col items-center select-none"
    >
      {/* The rotated figure — arrow at top = gaze direction */}
      <div
        style={{ transform: `rotate(${figure.rotation}deg)` }}
        className="relative"
      >
        {/* Glow ring when selected */}
        {isSelected && (
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: '0 0 0 3px #C9A96E, 0 0 20px rgba(201,169,110,0.5)',
              borderRadius: '50%',
              top: 8, left: 6, right: 6, bottom: 8,
            }}
          />
        )}
        {isConnectingFrom && (
          <div
            className="absolute pointer-events-none animate-pulse"
            style={{
              boxShadow: '0 0 0 3px #3b82f6, 0 0 20px rgba(59,130,246,0.4)',
              borderRadius: '50%',
              top: 8, left: 6, right: 6, bottom: 8,
            }}
          />
        )}
        <div
          className={[
            'transition-transform duration-100',
            isConnectingMode && !isConnectingFrom && !isAlreadyConnected ? 'hover:scale-110' : '',
            isAlreadyConnected && isConnectingMode ? 'opacity-40' : '',
            isDragging ? 'scale-105' : '',
          ].join(' ')}
        >
          <PersonSVG color={figure.color} size={64} />
        </div>
      </div>

      {/* Label underneath — not rotated */}
      <div className="flex flex-col items-center mt-1.5" style={{ transform: 'none' }}>
        {figure.label && (
          <span
            className="text-[12px] font-semibold leading-tight text-center max-w-[100px]"
            style={{
              color: '#2d1a0e',
              background: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(4px)',
              padding: '2px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
            }}
          >
            {figure.label}
          </span>
        )}
        {!figure.label && isSelected && (
          <span className="text-[10px] italic" style={{ color: 'rgba(60,30,10,0.35)' }}>
            Name eingeben →
          </span>
        )}
        {colorLabel && !isSelected && figure.label && (
          <span className="text-[9px] mt-0.5" style={{ color: 'rgba(60,30,10,0.35)' }}>
            {colorLabel}
          </span>
        )}
      </div>
    </div>
  )
}
