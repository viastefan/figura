import { create } from 'zustand'
import type { Figure, Connection } from '@/types/database'

interface BoardState {
  figures: Figure[]
  connections: Connection[]
  selectedId: string | null
  connectingFrom: string | null
  setFigures: (figures: Figure[]) => void
  addFigure: (figure: Figure) => void
  updateFigure: (id: string, updates: Partial<Figure>) => void
  removeFigure: (id: string) => void
  selectFigure: (id: string | null) => void
  getMaxZIndex: () => number
  addConnection: (conn: Connection) => void
  removeConnection: (id: string) => void
  setConnectingFrom: (id: string | null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  figures: [],
  connections: [],
  selectedId: null,
  connectingFrom: null,

  setFigures: (figures) => set({ figures }),

  addFigure: (figure) =>
    set((state) => ({ figures: [...state.figures, figure] })),

  updateFigure: (id, updates) =>
    set((state) => ({
      figures: state.figures.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),

  removeFigure: (id) =>
    set((state) => ({
      figures: state.figures.filter((f) => f.id !== id),
      connections: state.connections.filter(
        (c) => c.fromId !== id && c.toId !== id
      ),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  selectFigure: (id) => set({ selectedId: id, connectingFrom: null }),

  getMaxZIndex: () => {
    const { figures } = get()
    if (figures.length === 0) return 0
    return Math.max(...figures.map((f) => f.z_index))
  },

  addConnection: (conn) =>
    set((state) => ({ connections: [...state.connections, conn] })),

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
    })),

  setConnectingFrom: (id) => set({ connectingFrom: id }),
}))
