'use client'

import type { Shape } from '@/types/database'

export function FigureShape({
  shape,
  color,
  size = 52,
}: {
  shape: Shape
  color: string
  size?: number
}) {
  const half = size / 2

  switch (shape) {
    case 'circle':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <radialGradient id={`cg-${color.replace('#','')}`} cx="35%" cy="30%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </radialGradient>
          </defs>
          <circle cx={half} cy={half} r={half - 2} fill={`url(#cg-${color.replace('#','')})`} stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} />
          <circle cx={half} cy={half} r={half - 2} fill={color} fillOpacity="0.7" stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} />
        </svg>
      )
    case 'square':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect x={3} y={3} width={size - 6} height={size - 6} rx={5} fill={color} fillOpacity="0.85" stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} />
          <rect x={3} y={3} width={size - 6} height={(size - 6) * 0.4} rx={5} fill="white" fillOpacity="0.15" />
        </svg>
      )
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={`${half},4 ${size - 4},${size - 4} 4,${size - 4}`}
            fill={color} fillOpacity="0.85"
            stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} strokeLinejoin="round"
          />
        </svg>
      )
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={`${half},3 ${size - 3},${half} ${half},${size - 3} 3,${half}`}
            fill={color} fillOpacity="0.85"
            stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} strokeLinejoin="round"
          />
        </svg>
      )
  }
}
