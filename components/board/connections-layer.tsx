'use client'

import { useBoardStore } from '@/lib/store/board-store'

const FIGURE_CENTER = 26 // half of 52px figure size

export function ConnectionsLayer() {
  const { figures, connections, removeConnection } = useBoardStore()

  function getCenter(id: string) {
    const fig = figures.find((f) => f.id === id)
    if (!fig) return null
    return { x: fig.x + FIGURE_CENTER, y: fig.y + FIGURE_CENTER }
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        <marker id="arrow-end" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#1F4045" opacity="0.5" />
        </marker>
      </defs>
      {connections.map((conn) => {
        const from = getCenter(conn.fromId)
        const to = getCenter(conn.toId)
        if (!from || !to) return null

        const dx = to.x - from.x
        const dy = to.y - from.y
        const len = Math.sqrt(dx * dx + dy * dy)
        const offset = 28
        const x1 = from.x + (dx / len) * offset
        const y1 = from.y + (dy / len) * offset
        const x2 = to.x - (dx / len) * offset
        const y2 = to.y - (dy / len) * offset

        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2

        return (
          <g key={conn.id}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={conn.color}
              strokeWidth={conn.style === 'solid' ? 2 : 1.5}
              strokeDasharray={
                conn.style === 'dashed' ? '8,5' :
                conn.style === 'dotted' ? '2,4' : undefined
              }
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Invisible wider hit area for deletion */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="transparent"
              strokeWidth={16}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              onClick={() => removeConnection(conn.id)}
            />
            {/* Delete button at midpoint */}
            <g
              transform={`translate(${midX}, ${midY})`}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              onClick={() => removeConnection(conn.id)}
              className="opacity-0 hover:opacity-100 transition-opacity"
            >
              <circle r="8" fill="white" stroke="#e5e7eb" strokeWidth="1" />
              <text x="0" y="4" textAnchor="middle" fontSize="11" fill="#9ca3af">×</text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}
