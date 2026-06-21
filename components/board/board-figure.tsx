'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { FigureShape } from './figure-shape'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

export function BoardFigure({ figure }: { figure: Figure }) {
  const { selectedId, selectFigure, connectingFrom, setConnectingFrom, addConnection, connections } = useBoardStore()
  const isSelected = selectedId === figure.id
  const isConnecting = connectingFrom !== null
  const isConnectingFrom = connectingFrom === figure.id
  const isAlreadyConnected = connections.some(
    (c) => (c.fromId === connectingFrom && c.toId === figure.id) ||
            (c.toId === connectingFrom && c.fromId === figure.id)
  )

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: figure.id, data: figure })

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
          color: '#1F4045',
        })
      }
      setConnectingFrom(null)
    } else {
      selectFigure(figure.id)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isConnecting && !isConnectingFrom ? {} : listeners)}
      {...attributes}
      onClick={handleClick}
      className="group flex flex-col items-center select-none"
    >
      {/* Direction arrow */}
      <div
        className="flex flex-col items-center"
        style={{ transform: `rotate(${figure.rotation}deg)` }}
      >
        <svg width="10" height="7" viewBox="0 0 10 7" className="mb-0.5 opacity-70">
          <polygon points="5,0 10,7 0,7" fill="#1F4045" />
        </svg>
        <div className={`relative transition-all duration-150 ${
          isSelected ? 'drop-shadow-[0_0_8px_rgba(201,169,110,0.8)]' : ''
        } ${isConnectingFrom ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : ''}
        ${isConnecting && !isConnectingFrom && !isAlreadyConnected ? 'hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : ''}
        `}>
          <FigureShape shape={figure.shape} color={figure.color} size={52} />
          {isSelected && (
            <div className="absolute inset-0 rounded-full ring-2 ring-[#C9A96E] ring-offset-2 pointer-events-none" />
          )}
        </div>
      </div>

      {/* Label */}
      {figure.label && (
        <span className="mt-1.5 text-[11px] font-medium text-[#1F4045] max-w-[80px] text-center leading-tight bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md shadow-sm">
          {figure.label}
        </span>
      )}
    </div>
  )
}
