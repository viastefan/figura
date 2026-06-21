'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

// Proper systemic board person: direction arrow pointing UP = looking forward
function PersonFigure({ color, size = 56 }: { color: string; size?: number }) {
  const s = size
  return (
    <svg width={s} height={s + 8} viewBox="0 0 56 64" fill="none">
      {/* Arrow pointing UP = direction the figure is "looking" */}
      <polygon points="28,1 34,11 22,11" fill="#3d2b1a" opacity="0.65" />
      {/* Head */}
      <circle cx="28" cy="23" r="10" fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth="1.5" />
      {/* Subtle shine on head */}
      <ellipse cx="24" cy="20" rx="4" ry="3" fill="white" opacity="0.22" />
      {/* Body / torso */}
      <path
        d="M14 48 C14 37 42 37 42 48 L42 58 C42 61 40 63 37 63 L19 63 C16 63 14 61 14 58 Z"
        fill={color}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1.5"
      />
      {/* Subtle body highlight */}
      <ellipse cx="28" cy="42" rx="7" ry="4" fill="white" opacity="0.12" />
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
  const isConnecting = connectingFrom !== null
  const isConnectingFrom = connectingFrom === figure.id
  const isAlreadyConnected = connections.some(
    (c) =>
      (c.fromId === connectingFrom && c.toId === figure.id) ||
      (c.toId === connectingFrom && c.fromId === figure.id)
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
    cursor: isDragging ? 'grabbing' : isConnecting && !isConnectingFrom ? 'crosshair' : 'grab',
    touchAction: 'none',
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (isConnecting && !isConnectingFrom) {
      if (!isAlreadyConnected && connectingFrom) {
        addConnection({
          id: crypto.randomUUID(),
          fromId: connectingFrom,
          toId: figure.id,
          style: 'solid',
          color: '#3d2b1a',
        })
      }
      setConnectingFrom(null)
    } else {
      selectFigure(figure.id)
      updateFigure(figure.id, { z_index: getMaxZIndex() + 1 })
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isConnecting && !isConnectingFrom ? {} : listeners)}
      {...attributes}
      onClick={handleClick}
      className="flex flex-col items-center select-none group"
    >
      {/* Rotate whole figure — arrow always shows facing direction */}
      <div
        style={{ transform: `rotate(${figure.rotation}deg)` }}
        className="flex flex-col items-center"
      >
        <div
          className={[
            'relative transition-all duration-100',
            isSelected ? 'drop-shadow-[0_0_12px_rgba(201,169,110,1)]' : '',
            isConnectingFrom ? 'drop-shadow-[0_0_12px_rgba(59,130,246,1)]' : '',
            isConnecting && !isConnectingFrom && !isAlreadyConnected
              ? 'hover:drop-shadow-[0_0_12px_rgba(34,197,94,1)] hover:scale-110'
              : '',
            isAlreadyConnected && isConnecting ? 'opacity-40' : '',
          ].join(' ')}
        >
          <PersonFigure color={figure.color} size={52} />
        </div>
      </div>

      {/* Label */}
      {figure.label ? (
        <span className="mt-1.5 text-[11px] font-semibold text-[#3d2b1a] max-w-[90px] text-center leading-tight bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm border border-white/60">
          {figure.label}
        </span>
      ) : isSelected ? (
        <span className="mt-1.5 text-[10px] text-[#3d2b1a]/40 italic">Name eingeben…</span>
      ) : null}

      {/* Selection ring */}
      {isSelected && (
        <div className="absolute -inset-3 rounded-full border-2 border-[#C9A96E] pointer-events-none" />
      )}
    </div>
  )
}
