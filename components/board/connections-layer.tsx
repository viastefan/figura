'use client'

import { useBoardStore } from '@/lib/store/board-store'

const FIG_W = 64
const FIG_H = 80
const FIG_CX = FIG_W / 2
const FIG_CY = FIG_H / 2

export function ConnectionsLayer() {
  const { figures, connections, removeConnection } = useBoardStore()

  function getCenter(id: string) {
    const f = figures.find((x) => x.id === id)
    if (!f) return null
    return { x: f.x + FIG_CX, y: f.y + FIG_CY }
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {connections.map((conn) => {
        const from = getCenter(conn.fromId)
        const to = getCenter(conn.toId)
        if (!from || !to) return null

        const dx = to.x - from.x
        const dy = to.y - from.y
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len < 1) return null
        const offset = 34
        const x1 = from.x + (dx / len) * offset
        const y1 = from.y + (dy / len) * offset
        const x2 = to.x - (dx / len) * offset
        const y2 = to.y - (dy / len) * offset
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2

        return (
          <g key={conn.id}>
            {/* Visible line */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={conn.color}
              strokeWidth="2"
              strokeDasharray={conn.style === 'dashed' ? '8,5' : conn.style === 'dotted' ? '2,5' : undefined}
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Thick invisible hit area */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="transparent"
              strokeWidth="20"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              onClick={() => removeConnection(conn.id)}
            />
            {/* Delete dot at midpoint (visible on hover) */}
            <g
              transform={`translate(${midX},${midY})`}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              className="opacity-0 hover:opacity-100 transition-opacity"
              onClick={() => removeConnection(conn.id)}
            >
              <circle r="10" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
              <line x1="-4" y1="-4" x2="4" y2="4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="-4" x2="-4" y2="4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>
        )
      })}
    </svg>
  )
}
