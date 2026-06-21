'use client'

const COLORS: { hex: string; role: string; meaning: string }[] = [
  { hex: '#E8B4B8', role: 'Fürsorge', meaning: 'Mutter, Fürsorgende' },
  { hex: '#A8C5DA', role: 'Ruhe', meaning: 'Rückzug, Distanz' },
  { hex: '#B5D5A7', role: 'Wachstum', meaning: 'Kind, Aufblühen' },
  { hex: '#F2D479', role: 'Energie', meaning: 'Kraft, Lebendigkeit' },
  { hex: '#C4A6E0', role: 'Intuition', meaning: 'Spirituelles, Unbewusstes' },
  { hex: '#F5C5A3', role: 'Wärme', meaning: 'Verbindung, Zuneigung' },
  { hex: '#94A3B8', role: 'Distanz', meaning: 'Abgrenzung, Kälte' },
  { hex: '#F87171', role: 'Konflikt', meaning: 'Spannung, Streit' },
  { hex: '#6B8F71', role: 'Stabilität', meaning: 'Halt, Verwurzelung' },
  { hex: '#D4A5A5', role: 'Verlust', meaning: 'Trauer, Schmerz' },
]

export function FigurePalette({ onAdd }: { onAdd: (color: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-semibold text-[#1F4045]/40 uppercase tracking-widest mb-2">
          Neue Figur hinzufügen
        </p>
        <p className="text-[11px] text-[#1F4045]/50 leading-relaxed mb-3">
          Wähle eine Farbe. Die Figur erscheint auf dem Brett — dann Name eingeben und platzieren.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {COLORS.map(({ hex, role, meaning }) => (
          <button
            key={hex}
            onClick={() => onAdd(hex)}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/50 hover:bg-white/90 border border-white/60 hover:border-white transition-all hover:shadow-sm group text-left"
            title={meaning}
          >
            <div
              className="w-8 h-8 rounded-full shrink-0 shadow-sm border border-white/50 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: hex }}
            />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#1F4045]/80 leading-tight">{role}</p>
              <p className="text-[9px] text-[#1F4045]/40 leading-tight truncate">{meaning}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-[#C9A96E]/10 rounded-xl p-3 border border-[#C9A96E]/20">
        <p className="text-[10px] text-[#1F4045]/60 leading-relaxed">
          <strong className="text-[#1F4045]/80">Tipp:</strong> Die Blickrichtung (Pfeil) zeigt wohin eine Person schaut — im "Bearbeiten"-Tab rotieren.
        </p>
      </div>
    </div>
  )
}
