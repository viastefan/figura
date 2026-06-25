export type Shape = 'circle' | 'square' | 'triangle' | 'diamond'
export type SessionStatus = 'active' | 'archived'
export type ConnectionStyle = 'solid' | 'dashed' | 'dotted'
export type ConnectionSemantics = 'neutral' | 'strong' | 'conflict' | 'weak' | 'resource'

export interface Session {
  id: string
  owner_id: string
  title: string
  client_token: string
  status: SessionStatus
  created_at: string
  updated_at: string
}

export interface Figure {
  id: string
  session_id: string
  shape: Shape
  color: string
  label: string
  x: number
  y: number
  rotation: number
  z_index: number
  updated_at: string
}

export interface Connection {
  id: string
  fromId: string
  toId: string
  style: ConnectionStyle
  color: string
  semantics: ConnectionSemantics
}

export interface Snapshot {
  id: string
  session_id: string
  note: string | null
  state: Figure[]
  connections: Connection[]
  created_at: string
}
