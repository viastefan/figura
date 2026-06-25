'use client'

import { useBoardStore } from '@/lib/store/board-store'
import type { ConnectionSemantics } from '@/types/database'

const FIG_CX = 32
const FIG_CY = 40

const SEMANTICS_CONFIG: Record<ConnectionSemantics, {
  stroke: string; dash?: string; width: number; label: string
}> = {
  neutral:  { stroke: '#5c3d1e', width: 2, label: 'Neutral' },
  strong:   { stroke: '#1F4045', width: 3, label: 'Stark' },
  weak:     { stroke: '#94A3B8', width: 1.5, dash: '6,5', label: 'Schwach' },
  conflict: { stroke: '#ef4444', width: 2.5, dash: '4,3', label: 'Konflikt' },
  resource: { stroke: '#6B8F71', width: 2, dash: '8,4', label: 'Ressource' },
}

export function ConnectionsLayer() {
  const { figures, connections, selectedConnectionId, selectConnection, removeConnection } = useBoardStore()

  function getCenter(id: string) {
    const f = figures.find((x) => x.id === id)
    if (!f) return null
    return { x: f.x + FIG_CX, y: f.y + FIG_CY }
  }

  return (
    <svg className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        {Object.entries(SEMANTICS_CONFIG).map(([key, cfg]) => (
          <marker key={key} id={`arrow-${key}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={cfg.stroke} opacity="0.6" />
          </marker>
        ))}
      </defs>

      {connections.map((conn) => {
        const from = getCenter(conn.fromId)
        const to = getCenter(conn.toId)
        if (!from || !to) return null

        const dx = to.x - from.x
        const dy = to.y - from.y
        const len = Math.sqrt(dx * dx + dy * dy)
        if (len < 2) return null

        const offset = 36
        const x1 = from.x + (dx / len) * offset
        const y1 = from.y + (dy / len) * offset
        const x2 = to.x - (dx / len) * offset
        const y2 = to.y - (dy / len) * offset
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2

        const sem = conn.semantics ?? 'neutral'
        const cfg = SEMANTICS_CONFIG[sem]
        const isSelected = selectedConnectionId === conn.id

        return (
          <g key={conn.id}>
            {/* Visible line */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={cfg.stroke}
              strokeWidth={isSelected ? cfg.width + 1.5 : cfg.width}
              strokeDasharray={cfg.dash}
              strokeLinecap="round"
              opacity={isSelected ? 0.9 : 0.55}
            />
            {/* Selection halo */}
            {isSelected && (
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={cfg.stroke} strokeWidth={cfg.width + 8}
                opacity="0.12" strokeLinecap="round" />
            )}
            {/* Wide invisible hit area */}
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="transparent" strokeWidth="22"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); selectConnection(isSelected ? null : conn.id) }}
            />
            {/* Mid label chip */}
            <g transform={`translate(${midX},${midY})`}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); selectConnection(isSelected ? null : conn.id) }}>
              <rect x="-20" y="-10" width="40" height="20" rx="10"
                fill="white" stroke={cfg.stroke} strokeWidth="1"
                opacity={isSelected ? 1 : 0}
                className="group-hover:opacity-100 transition-opacity" />
              <text x="0" y="4" textAnchor="middle" fontSize="9" fontWeight="600"
                fill={cfg.stroke} opacity={isSelected ? 1 : 0}>
                {cfg.label}
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}
