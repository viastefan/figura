'use client'

import { useState } from 'react'
import { useBoardStore } from '@/lib/store/board-store'
import type { Figure } from '@/types/database'

const COLOR_MEANINGS: Record<string, string> = {
  '#c8a882': 'neutral',
  '#E8B4B8': 'fürsorglich (Rosa)',
  '#A8C5DA': 'ruhig (Blau)',
  '#B5D5A7': 'wachsend (Grün)',
  '#F2D479': 'energetisch (Gelb)',
  '#C4A6E0': 'intuitiv (Lila)',
  '#F5C5A3': 'warm (Orange)',
  '#94A3B8': 'distanziert (Grau)',
  '#F87171': 'in Konflikt (Rot)',
}

function buildDescription(figures: Figure[], connections: { fromId: string; toId: string }[]): string {
  if (figures.length === 0) return 'Keine Figuren auf dem Brett.'

  const boardW = 1200, boardH = 800
  const centerX = boardW / 2, centerY = boardH / 2

  const descs = figures.map((f) => {
    const dx = (f.x + 26) - centerX
    const dy = (f.y + 30) - centerY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY)
    const relDist = dist / maxDist

    const zone = relDist < 0.2 ? 'im Zentrum des Bretts'
      : relDist < 0.45 ? 'in der Mitte'
      : relDist < 0.7 ? 'weiter außen'
      : 'am Rand des Bretts'

    const r = ((f.rotation % 360) + 360) % 360
    const facing = r < 22.5 || r >= 337.5 ? 'schaut nach oben (vom Zentrum weg)'
      : r < 67.5 ? 'schaut nach rechts-oben'
      : r < 112.5 ? 'schaut nach rechts'
      : r < 157.5 ? 'schaut nach rechts-unten'
      : r < 202.5 ? 'schaut nach unten (zum Zentrum hin)'
      : r < 247.5 ? 'schaut nach links-unten'
      : r < 292.5 ? 'schaut nach links'
      : 'schaut nach links-oben'

    const colorMeaning = COLOR_MEANINGS[f.color] ?? 'unbekannte Farbe'
    const name = f.label ? `"${f.label}"` : '(unbenannt)'

    const connectedTo = connections
      .filter(c => c.fromId === f.id || c.toId === f.id)
      .map(c => {
        const otherId = c.fromId === f.id ? c.toId : c.fromId
        const other = figures.find(fig => fig.id === otherId)
        return other?.label ? `"${other.label}"` : null
      })
      .filter(Boolean)

    return `• ${name} — ${zone}, ${facing}, Farbe: ${colorMeaning}${
      connectedTo.length > 0 ? `, verbunden mit: ${connectedTo.join(', ')}` : ''
    }`
  }).join('\n')

  const connSummary = connections.length > 0
    ? `\nVerbindungen im System: ${connections.length}`
    : ''

  return descs + connSummary
}

const QUICK_QUESTIONS = [
  'Was fällt dir als erstes auf?',
  'Wer scheint am meisten isoliert?',
  'Welche Beziehungen wirken angespannt?',
  'Was könnte ein nächster hilfreicher Schritt sein?',
]

export function AiPanel({ sessionTitle }: { sessionTitle: string }) {
  const { figures, connections } = useBoardStore()
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')

  async function runAnalysis(customPrompt?: string) {
    if (figures.length === 0) return
    setLoading(true)
    setAnalysis('')

    const boardDesc = buildDescription(figures, connections)

    const prompt = customPrompt
      ? `Du bist ein erfahrener systemischer Berater mit tiefem Verständnis für Aufstellungsarbeit.

Sitzung: "${sessionTitle}"

Aktuelle Aufstellung auf dem Systembrett:
${boardDesc}

Frage des Beraters: ${customPrompt}

Antworte in 2-4 Sätzen, systemisch, phänomenologisch, ohne zu bewerten. Spreche von dem was du siehst, nicht von dem was es bedeutet.`
      : `Du bist ein erfahrener systemischer Berater mit tiefem Verständnis für Aufstellungsarbeit.

Sitzung: "${sessionTitle}"

Aktuelle Aufstellung auf dem Systembrett:
${boardDesc}

Beschreibe in 3-5 Sätzen was du in dieser Konstellation phänomenologisch wahrnimmst. Achte besonders auf:
- Nähe und Distanz zwischen Figuren
- Blickrichtungen: wer schaut wen an, wer schaut weg?
- Zentrum und Peripherie: wer steht wo im System?
- Verbindungen und Trennungen

Bleibe beim Phänomen. Keine Interpretationen oder Ratschläge. Systemische Sprache.`

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setAnalysis(data.text || 'Keine Antwort erhalten.')
    } catch {
      setAnalysis('Verbindungsfehler. Bitte erneut versuchen.')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-[#3d2b1a]/50 uppercase tracking-widest">KI-Perspektive ✦</span>
        <p className="text-[10px] text-[#3d2b1a]/50 leading-relaxed">
          Die KI liest Positionen, Blickrichtungen und Verbindungen und gibt eine systemische Einschätzung.
        </p>
      </div>

      {/* Main analyse button */}
      <button
        onClick={() => runAnalysis()}
        disabled={loading || figures.length === 0}
        className="w-full py-3 rounded-xl bg-[#1F4045] text-white text-[12px] font-medium hover:bg-[#1F4045]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        {loading ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analysiere Aufstellung…
          </>
        ) : (
          <>✦ Aufstellung analysieren</>
        )}
      </button>

      {figures.length === 0 && (
        <p className="text-[10px] text-[#3d2b1a]/40 italic text-center">
          Erst Figuren auf das Brett setzen
        </p>
      )}

      {/* Quick questions */}
      {figures.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-[#3d2b1a]/50 uppercase tracking-widest">Schnell fragen</span>
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => { setQuestion(q); runAnalysis(q) }}
              disabled={loading}
              className="text-left text-[10px] text-[#3d2b1a]/60 hover:text-[#3d2b1a] px-3 py-2 rounded-lg bg-white/50 hover:bg-white/80 border border-white/60 hover:border-[#C9A96E]/30 transition-all disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Custom question */}
      {figures.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-[#3d2b1a]/50 uppercase tracking-widest">Eigene Frage</span>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="z.B. Was könnte die Distanz zwischen Vater und Kind bedeuten?"
            className="w-full text-[11px] p-2.5 rounded-xl bg-white/70 border border-white/80 resize-none h-20 focus:outline-none focus:bg-white focus:border-[#C9A96E]/40 placeholder:text-[#3d2b1a]/25 text-[#3d2b1a]"
          />
          <button
            onClick={() => runAnalysis(question)}
            disabled={loading || !question.trim() || figures.length === 0}
            className="w-full py-2 text-[11px] rounded-xl bg-white/80 border border-[#C9A96E]/30 text-[#3d2b1a]/70 hover:bg-white hover:text-[#3d2b1a] disabled:opacity-40 transition-all"
          >
            Frage stellen →
          </button>
        </div>
      )}

      {/* Response */}
      {analysis && (
        <div className="bg-white/85 rounded-2xl p-4 border border-[#C9A96E]/25 shadow-sm">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[#C9A96E] text-sm">✦</span>
            <span className="text-[9px] font-bold text-[#C9A96E] uppercase tracking-widest">KI-Wahrnehmung</span>
          </div>
          <p className="text-[11px] text-[#3d2b1a]/75 leading-relaxed">{analysis}</p>
        </div>
      )}
    </div>
  )
}
