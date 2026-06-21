import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col min-h-full" style={{ background: 'linear-gradient(160deg, #faf6ee 0%, #f0e6cc 100%)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto w-full">
        <span className="text-xl font-semibold tracking-tight text-[#1F4045]">Figura</span>
        <div className="flex items-center gap-6">
          <a href="#wie" className="text-sm text-[#1F4045]/60 hover:text-[#1F4045] transition-colors">Wie es funktioniert</a>
          <Link href="/login" className="text-sm px-4 py-2 rounded-full bg-[#1F4045] text-white hover:bg-[#1F4045]/90 transition-colors">
            Anmelden
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-20 max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#1F4045]/70 text-xs font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
          DSGVO-konform · Server in Frankfurt
        </div>

        <h1 className="text-5xl font-semibold tracking-tight text-[#1F4045] leading-tight mb-6">
          Das digitale<br />
          <span style={{ color: '#C9A96E' }}>Systembrett</span>
        </h1>

        <p className="text-lg text-[#1F4045]/60 max-w-xl leading-relaxed mb-10">
          Figuren setzen, verschieben, verknüpfen — gemeinsam mit dem Klienten in Echtzeit.
          Für systemische Berater und Coaches, die online arbeiten.
        </p>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-6 py-3 rounded-full bg-[#1F4045] text-white text-sm font-medium hover:bg-[#1F4045]/90 transition-all shadow-lg shadow-[#1F4045]/20 hover:shadow-xl hover:shadow-[#1F4045]/25 hover:-translate-y-0.5"
          >
            Kostenlos starten →
          </Link>
          <Link
            href="/session/demo-1"
            className="px-6 py-3 rounded-full bg-white/80 text-[#1F4045] text-sm font-medium border border-[#1F4045]/10 hover:bg-white transition-all"
          >
            Demo ansehen
          </Link>
        </div>
      </section>

      {/* Board preview */}
      <section className="px-8 pb-20 max-w-5xl mx-auto w-full">
        <div
          className="w-full h-80 rounded-3xl relative overflow-hidden shadow-2xl shadow-[#1F4045]/10 border border-[#C9A96E]/20"
          style={{ background: 'linear-gradient(160deg, #e8d5b0 0%, #dcc890 40%, #d4b87a 100%)' }}
        >
          {/* Wood grain */}
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(88deg, transparent 0px, transparent 18px, rgba(139,90,43,0.025) 18px, rgba(139,90,43,0.025) 19px)`,
          }} />
          {/* Oval frame */}
          <div className="absolute inset-8 pointer-events-none" style={{
            border: '2px solid rgba(139,90,43,0.15)',
            borderRadius: '48% 52% 50% 50% / 44% 44% 56% 56%',
          }} />

          {/* Demo figures */}
          {[
            { x: '28%', y: '35%', color: '#E8B4B8', label: 'Mutter', rot: -20 },
            { x: '48%', y: '28%', color: '#A8C5DA', label: 'Vater', rot: 15 },
            { x: '38%', y: '58%', color: '#B5D5A7', label: 'Kind', rot: -5 },
            { x: '62%', y: '48%', color: '#C4A6E0', label: 'Großmutter', rot: 30 },
            { x: '20%', y: '62%', color: '#F2D479', label: 'Ressource', rot: 0 },
          ].map((f, i) => (
            <div key={i} className="absolute flex flex-col items-center" style={{ left: f.x, top: f.y, transform: `translate(-50%,-50%)` }}>
              <div style={{ transform: `rotate(${f.rot}deg)` }} className="flex flex-col items-center">
                <svg width="8" height="5" viewBox="0 0 8 5"><polygon points="4,0 8,5 0,5" fill="#1F4045" opacity="0.5"/></svg>
                <div className="w-10 h-10 rounded-full border-2 border-white/40 shadow-lg mt-0.5" style={{ backgroundColor: f.color }} />
              </div>
              <span className="mt-1 text-[9px] font-medium text-[#1F4045] bg-white/60 px-1.5 rounded-md">{f.label}</span>
            </div>
          ))}

          {/* Connection line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            <line x1="28%" y1="35%" x2="48%" y2="28%" stroke="#1F4045" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.3" />
            <line x1="48%" y1="28%" x2="38%" y2="58%" stroke="#1F4045" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.3" />
          </svg>

          {/* KI badge */}
          <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur rounded-xl px-3 py-2 text-xs text-[#1F4045]/70 border border-white/60 shadow-sm flex items-center gap-1.5">
            <span className="text-[#C9A96E]">✦</span> KI-Analyse aktiv
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="wie" className="px-8 py-20 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-[#1F4045] text-center mb-12">Wie es funktioniert</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Sitzung erstellen', desc: 'Neue Sitzung anlegen und Klienten-Link teilen. Kein Account für den Klienten nötig.' },
            { step: '02', title: 'Aufstellen', desc: 'Figuren platzieren, benennen, drehen und verbinden — in Echtzeit, gemeinsam sichtbar.' },
            { step: '03', title: 'Analysieren', desc: 'KI gibt systemische Perspektiven zur Konstellation. Snapshots dokumentieren Entwicklung.' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col gap-3">
              <span className="text-3xl font-light text-[#C9A96E]/60">{item.step}</span>
              <h3 className="font-semibold text-[#1F4045]">{item.title}</h3>
              <p className="text-sm text-[#1F4045]/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-16 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-[#1F4045] mb-4">Bereit für das digitale Systembrett?</h2>
          <p className="text-sm text-[#1F4045]/60 mb-8">Kostenlos testen. Keine Kreditkarte erforderlich.</p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-full bg-[#1F4045] text-white text-sm font-medium hover:bg-[#1F4045]/90 transition-all shadow-lg shadow-[#1F4045]/20"
          >
            Jetzt kostenlos starten
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F4045]/10 px-8 py-6">
        <div className="flex items-center justify-between max-w-5xl mx-auto text-xs text-[#1F4045]/40">
          <span>© 2026 Figura</span>
          <div className="flex gap-5">
            <Link href="/datenschutz" className="hover:text-[#1F4045] transition-colors">Datenschutz</Link>
            <Link href="/impressum" className="hover:text-[#1F4045] transition-colors">Impressum</Link>
            <Link href="/agb" className="hover:text-[#1F4045] transition-colors">AGB</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
