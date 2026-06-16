export type Shape = 'circle' | 'square' | 'triangle' | 'diamond'
export type SessionStatus = 'active' | 'archived'

export interface Profile {
  id: string
  email: string
  display_name: string | null
  created_at: string
}

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

export interface Snapshot {
  id: string
  session_id: string
  note: string | null
  state: Figure[]
  created_at: string
}
