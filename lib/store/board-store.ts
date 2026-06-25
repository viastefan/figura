import { create } from 'zustand'
import type { Figure, Connection } from '@/types/database'

interface BoardState {
  figures: Figure[]
  connections: Connection[]
  selectedId: string | null
  selectedConnectionId: string | null
  connectingFrom: string | null
  sessionNote: string
  setFigures: (figures: Figure[]) => void
  setConnections: (connections: Connection[]) => void
  addFigure: (figure: Figure) => void
  updateFigure: (id: string, updates: Partial<Figure>) => void
  removeFigure: (id: string) => void
  selectFigure: (id: string | null) => void
  selectConnection: (id: string | null) => void
  getMaxZIndex: () => number
  addConnection: (conn: Connection) => void
  updateConnection: (id: string, updates: Partial<Connection>) => void
  removeConnection: (id: string) => void
  setConnectingFrom: (id: string | null) => void
  setSessionNote: (note: string) => void
  clearBoard: () => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  figures: [],
  connections: [],
  selectedId: null,
  selectedConnectionId: null,
  connectingFrom: null,
  sessionNote: '',

  setFigures: (figures) => set({ figures }),
  setConnections: (connections) => set({ connections }),

  addFigure: (figure) =>
    set((state) => ({ figures: [...state.figures, figure] })),

  updateFigure: (id, updates) =>
    set((state) => ({
      figures: state.figures.map((f) => f.id === id ? { ...f, ...updates } : f),
    })),

  removeFigure: (id) =>
    set((state) => ({
      figures: state.figures.filter((f) => f.id !== id),
      connections: state.connections.filter((c) => c.fromId !== id && c.toId !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  selectFigure: (id) => set({ selectedId: id, selectedConnectionId: null, connectingFrom: null }),
  selectConnection: (id) => set({ selectedConnectionId: id, selectedId: null }),

  getMaxZIndex: () => {
    const { figures } = get()
    if (figures.length === 0) return 0
    return Math.max(...figures.map((f) => f.z_index))
  },

  addConnection: (conn) =>
    set((state) => ({ connections: [...state.connections, conn] })),

  updateConnection: (id, updates) =>
    set((state) => ({
      connections: state.connections.map((c) => c.id === id ? { ...c, ...updates } : c),
    })),

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
      selectedConnectionId: state.selectedConnectionId === id ? null : state.selectedConnectionId,
    })),

  setConnectingFrom: (id) => set({ connectingFrom: id }),
  setSessionNote: (note) => set({ sessionNote: note }),
  clearBoard: () => set({ figures: [], connections: [], selectedId: null, selectedConnectionId: null }),
}))
