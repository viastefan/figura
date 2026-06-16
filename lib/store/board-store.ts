import { create } from 'zustand'
import type { Figure } from '@/types/database'

interface BoardState {
  figures: Figure[]
  selectedId: string | null
  setFigures: (figures: Figure[]) => void
  addFigure: (figure: Figure) => void
  updateFigure: (id: string, updates: Partial<Figure>) => void
  removeFigure: (id: string) => void
  selectFigure: (id: string | null) => void
  getMaxZIndex: () => number
}

export const useBoardStore = create<BoardState>((set, get) => ({
  figures: [],
  selectedId: null,

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
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),

  selectFigure: (id) => set({ selectedId: id }),

  getMaxZIndex: () => {
    const { figures } = get()
    if (figures.length === 0) return 0
    return Math.max(...figures.map((f) => f.z_index))
  },
}))
