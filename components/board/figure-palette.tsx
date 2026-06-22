'use client'

const COLORS: { hex: string; role: string; hint: string }[] = [
  { hex: '#E8B4B8', role: 'Fürsorge', hint: 'Mutter, Pflegende' },
  { hex: '#A8C5DA', role: 'Ruhe', hint: 'Rückzug, Stille' },
  { hex: '#B5D5A7', role: 'Wachstum', hint: 'Kind, Aufblühen' },
  { hex: '#F2D479', role: 'Energie', hint: 'Kraft, Lebendigkeit' },
  { hex: '#C4A6E0', role: 'Intuition', hint: 'Spirituell, Unbewusst' },
  { hex: '#F5C5A3', role: 'Wärme', hint: 'Verbindung, Zuneigung' },
  { hex: '#94A3B8', role: 'Distanz', hint: 'Kälte, Abgrenzung' },
  { hex: '#F87171', role: 'Konflikt', hint: 'Spannung, Streit' },
  { hex: '#6B8F71', role: 'Stabilität', hint: 'Halt, Verwurzelung' },
  { hex: '#D4A5A5', role: 'Verlust', hint: 'Trauer, Schmerz' },
]

export function FigurePalette({ onAdd }: { onAdd: (color: string) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[11px] font-semibold text-[#1F4045] mb-1">Figur hinzufügen</p>
        <p className="text-[11px] text-[#1F4045]/50 leading-snug">
          Farbe auswählen → Figur erscheint auf dem Brett → Name vergeben.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {COLORS.map(({ hex, role, hint }) => (
          <button
            key={hex}
            onClick={() => onAdd(hex)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#1F4045]/5 transition-colors group text-left w-full"
          >
            <div
              className="w-9 h-9 rounded-full shrink-0 shadow-md group-hover:scale-105 transition-transform"
              style={{
                backgroundColor: hex,
                boxShadow: `0 2px 8px ${hex}88`,
                border: '2px solid rgba(255,255,255,0.8)',
              }}
            />
            <div>
              <p className="text-[13px] font-semibold text-[#1F4045]">{role}</p>
              <p className="text-[11px] text-[#1F4045]/45">{hint}</p>
            </div>
          </button>
        ))}
      </div>

      <div
        className="rounded-xl p-3 text-[11px] leading-relaxed"
        style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}
      >
        <strong className="text-[#1F4045]">Tipp:</strong>
        <span className="text-[#1F4045]/60"> Der Pfeil zeigt Blickrichtung. Unter "Bearbeiten" mit dem Kompass einstellen.</span>
      </div>
    </div>
  )
}
