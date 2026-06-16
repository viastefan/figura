'use client'

import type { Shape } from '@/types/database'

const SHAPE_SIZE = 48

export function FigureShape({
  shape,
  color,
  size = SHAPE_SIZE,
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
          <circle cx={half} cy={half} r={half - 2} fill={color} stroke="#1F4045" strokeWidth={1.5} />
        </svg>
      )
    case 'square':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <rect x={2} y={2} width={size - 4} height={size - 4} rx={3} fill={color} stroke="#1F4045" strokeWidth={1.5} />
        </svg>
      )
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={`${half},3 ${size - 3},${size - 3} 3,${size - 3}`}
            fill={color}
            stroke="#1F4045"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={`${half},3 ${size - 3},${half} ${half},${size - 3} 3,${half}`}
            fill={color}
            stroke="#1F4045"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}
