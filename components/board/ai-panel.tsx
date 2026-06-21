'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

function describeFigures(figures: Figure[]): string {
  if (figures.length === 0) return 'Das Brett ist leer.'

  const center = { x: 600, y: 400 }

  return figures.map((f) => {
    const dx = f.x - center.x
    const dy = f.y - center.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    const pos =
      dist < 150 ? 'im Zentrum' :
      dist < 300 ? 'in der Mitte' :
      'am Rand'

    const dir = f.rotation
    const dirLabel =
      dir < 22 || dir >= 338 ? 'nach oben' :
      dir < 68 ? 'nach rechts-oben' :
      dir < 113 ? 'nach rechts' :
      dir < 158 ? 'nach rechts-unten' :
      dir < 203 ? 'nach unten' :
      dir < 248 ? 'nach links-unten' :
      dir < 293 ? 'nach links' :
      'nach links-oben'

    const colorMeaning: Record<string, string> = {
      '#E8B4B8': 'Rosa (Fürsorge)',
      '#A8C5DA': 'Blau (Ruhe)',
      '#B5D5A7': 'Grün (Wachstum)',
      '#F2D479': 'Gelb (Energie)',
      '#C4A6E0': 'Lila (Intuition)',
      '#F5C5A3': 'Orange (Wärme)',
      '#94A3B8': 'Grau (Distanz)',
      '#F87171': 'Rot (Konflikt)',
    }

    const shapeLabel: Record<string, string> = {
      circle: 'Person',
      square: 'Gruppe',
      triangle: 'Kraft',
      diamond: 'Idee',
    }

    return `- ${f.label ? `"${f.label}"` : 'Unbenannte Figur'} (${shapeLabel[f.shape]}, ${colorMeaning[f.color] ?? f.color}): steht ${pos}, schaut ${dirLabel}`
  }).join('\n')
}

export function AiPanel({ sessionTitle }: { sessionTitle: string }) {
  const { figures, connections } = useBoardStore()
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [mode, setMode] = useState<'analyse' | 'frage'>('analyse')

  async function handleAnalyse() {
    if (figures.length === 0) return
    setLoading(true)
    setAnalysis('')

    const figureDesc = describeFigures(figures)
    const connDesc = connections.length > 0
      ? `\nVerbindungen: ${connections.map(c => {
          const from = figures.find(f => f.id === c.fromId)
          const to = figures.find(f => f.id === c.toId)
          return `${from?.label || 'Figur'} ↔ ${to?.label || 'Figur'}`
        }).join(', ')}`
      : ''

    const prompt = mode === 'analyse'
      ? `Du bist ein erfahrener systemischer Berater. Analysiere die folgende Aufstellung aus der Sitzung "${sessionTitle}" systemisch und einfühlsam. Beschreibe was du in den Positionen, Blickrichtungen und Beziehungen siehst. Bleib beim Phänomen, ohne zu interpretieren oder zu bewerten. Nutze systemische Sprache. Halte dich kurz (max 200 Wörter).

Aktuelle Aufstellung:
${figureDesc}${connDesc}`
      : `Du bist ein erfahrener systemischer Berater. Die folgende Frage bezieht sich auf diese Aufstellung aus der Sitzung "${sessionTitle}". Antworte systemisch, ressourcenorientiert und kurz (max 150 Wörter).

Aufstellung:
${figureDesc}${connDesc}

Frage des Beraters: ${question}`

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setAnalysis(data.text || 'Keine Antwort erhalten.')
    } catch {
      setAnalysis('Fehler bei der KI-Analyse. Bitte erneut versuchen.')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-semibold text-[#1F4045]/50 uppercase tracking-widest flex-1">
          KI-Analyse
        </span>
        <div className="flex text-[9px] bg-white/60 rounded-lg overflow-hidden border border-white/80">
          <button
            onClick={() => setMode('analyse')}
            className={`px-2 py-1 ${mode === 'analyse' ? 'bg-[#1F4045] text-white' : 'text-[#1F4045]/60'}`}
          >
            Analyse
          </button>
          <button
            onClick={() => setMode('frage')}
            className={`px-2 py-1 ${mode === 'frage' ? 'bg-[#1F4045] text-white' : 'text-[#1F4045]/60'}`}
          >
            Frage
          </button>
        </div>
      </div>

      {mode === 'frage' && (
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="z.B. Was könnte die Distanz zwischen Vater und Kind bedeuten?"
          className="w-full text-[11px] p-2 rounded-lg bg-white/70 border border-white/80 resize-none h-16 focus:outline-none focus:bg-white placeholder:text-[#1F4045]/30 text-[#1F4045]"
        />
      )}

      <button
        onClick={handleAnalyse}
        disabled={loading || figures.length === 0 || (mode === 'frage' && !question.trim())}
        className="w-full py-2 text-[11px] font-medium rounded-lg bg-[#1F4045] text-white hover:bg-[#1F4045]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analysiere…
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor"/>
            </svg>
            {mode === 'analyse' ? 'Aufstellung analysieren' : 'Frage stellen'}
          </>
        )}
      </button>

      {figures.length === 0 && (
        <p className="text-[10px] text-[#1F4045]/40 italic text-center">
          Füge Figuren hinzu um die KI-Analyse zu nutzen
        </p>
      )}

      {analysis && (
        <div className="bg-white/80 rounded-xl p-3 border border-[#C9A96E]/20 shadow-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#C9A96E"/>
            </svg>
            <span className="text-[9px] font-semibold text-[#C9A96E] uppercase tracking-wider">KI-Perspektive</span>
          </div>
          <p className="text-[11px] text-[#1F4045]/80 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </p>
        </div>
      )}
    </div>
  )
}
