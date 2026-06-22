import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col" style={{ background: '#F7F3EE', color: '#1a1a1a' }}>

      {/* Nav */}
      <nav style={{ background: 'rgba(247,243,238,0.92)', borderBottom: '1px solid rgba(31,64,69,0.07)', backdropFilter: 'blur(16px)' }}
        className="sticky top-0 z-50 flex items-center justify-between px-8 h-16">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 68 80" fill="none">
            <circle cx="34" cy="24" r="14" fill="#1F4045" />
            <path d="M10 62 C10 46 58 46 58 62 L58 74 C58 77 56 79 53 79 L15 79 C12 79 10 77 10 74 Z" fill="#1F4045" />
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: '#1F4045' }}>Figura</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[['Anwendung', '#anwendung'], ['Funktionen', '#funktionen'], ['KI', '#ki']].map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: 13, color: 'rgba(26,26,26,0.5)' }} className="hover:text-black transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" style={{ fontSize: 13, color: 'rgba(26,26,26,0.55)' }} className="hover:text-black transition-colors">Anmelden</Link>
          <Link href="/session/demo-1" style={{ fontSize: 13, fontWeight: 500, background: '#1F4045', color: 'white', padding: '8px 18px', borderRadius: 100 }}
            className="hover:opacity-85 transition-opacity">Demo →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto w-full">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(31,64,69,0.07)', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A96E', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#1F4045' }}>SYSTEMISCHE PRAXIS — DIGITAL</span>
        </div>
        <h1 style={{ fontSize: 56, lineHeight: 1.06, fontWeight: 600, letterSpacing: '-0.03em', color: '#1F4045', marginBottom: 24, maxWidth: 680 }}>
          Das Systembrett für<br />
          <span style={{ color: '#C9A96E' }}>die moderne Praxis</span>
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(26,26,26,0.52)', maxWidth: 520, lineHeight: 1.6, marginBottom: 40 }}>
          Figuren platzieren, Blickrichtungen setzen, Beziehungen sichtbar machen —
          online im Videocall oder direkt am iPad in der Sitzung.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/login"
            style={{ padding: '14px 28px', borderRadius: 100, background: '#1F4045', color: 'white', fontSize: 14, fontWeight: 500, boxShadow: '0 8px 24px rgba(31,64,69,0.22)' }}
            className="hover:opacity-90 transition-opacity">Kostenlos starten →</Link>
          <Link href="/session/demo-1"
            style={{ padding: '14px 28px', borderRadius: 100, background: 'white', color: '#1F4045', fontSize: 14, fontWeight: 500, border: '1px solid rgba(31,64,69,0.12)' }}
            className="hover:border-[#1F4045]/25 transition-colors">Live-Demo ansehen</Link>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(26,26,26,0.3)', marginTop: 16 }}>DSGVO-konform · Server Frankfurt · Keine Kreditkarte</p>
      </section>

      {/* Board preview */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(201,169,110,0.2)', boxShadow: '0 32px 80px rgba(31,64,69,0.10)', background: 'linear-gradient(155deg, #ede0c4 0%, #dfc99a 50%, #d4b87a 100%)' }}>
          {/* Browser bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.18)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0.35)'].map((c, i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div style={{ flex: 1, margin: '0 16px', height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>figura.app/session/aufstellung</span>
            </div>
          </div>
          {/* Board */}
          <div style={{ position: 'relative', height: 340 }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(89.5deg, transparent 0px, transparent 24px, rgba(90,50,15,0.018) 24px, rgba(90,50,15,0.018) 25px)' }} />
            <div style={{ position: 'absolute', top: '8%', left: '8%', right: '8%', bottom: '8%', borderRadius: '50%', border: '2px solid rgba(80,45,15,0.2)' }} />
            {[
              { left: '35%', top: '36%', color: '#E8B4B8', label: 'Mutter', rot: -20 },
              { left: '54%', top: '28%', color: '#A8C5DA', label: 'Vater', rot: 40 },
              { left: '44%', top: '58%', color: '#B5D5A7', label: 'Kind', rot: 0 },
              { left: '66%', top: '50%', color: '#C4A6E0', label: 'Großmutter', rot: -30 },
              { left: '26%', top: '55%', color: '#F2D479', label: 'Ressource', rot: 10 },
            ].map((f, i) => (
              <div key={i} style={{ position: 'absolute', left: f.left, top: f.top, transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ transform: `rotate(${f.rot}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg width="8" height="6" viewBox="0 0 8 6"><polygon points="4,0 8,6 0,6" fill="rgba(60,30,10,0.6)" /></svg>
                  <svg width="40" height="47" viewBox="0 0 68 80" fill="none">
                    <ellipse cx="34" cy="77" rx="18" ry="4" fill="rgba(0,0,0,0.10)" />
                    <path d="M12 58 C12 44 56 44 56 58 L56 72 C56 75 54 77 51 77 L17 77 C14 77 12 75 12 72 Z" fill={f.color} />
                    <circle cx="34" cy="28" r="16" fill={f.color} />
                    <circle cx="34" cy="28" r="16" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#2d1a0e', background: 'rgba(255,255,255,0.85)', padding: '2px 6px', borderRadius: 5, marginTop: 3 }}>{f.label}</span>
              </div>
            ))}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
              <line x1="35%" y1="36%" x2="54%" y2="28%" stroke="rgba(60,30,10,0.25)" strokeWidth="1.5" strokeDasharray="5,4" />
              <line x1="35%" y1="36%" x2="44%" y2="58%" stroke="rgba(60,30,10,0.2)" strokeWidth="1.5" />
            </svg>
            <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)', borderRadius: 14, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#C9A96E', fontSize: 16 }}>✦</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#1F4045' }}>KI-Analyse</p>
                  <p style={{ fontSize: 10, color: 'rgba(31,64,69,0.45)' }}>Vater schaut weg vom System…</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two settings */}
      <section id="anwendung" className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-14">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#C9A96E', marginBottom: 12 }}>ANWENDUNG</p>
          <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', color: '#1F4045' }}>Für jedes Setting</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" stroke="#1F4045" strokeWidth="1.5"/>
                  <path d="M8 21h8M12 17v4" stroke="#1F4045" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ),
              title: 'Online-Beratung',
              desc: 'Klient bekommt einen Link und sieht das Brett in Echtzeit. Keine Installation, kein Account für Klienten — einfach öffnen und loslegen.',
              features: ['Echtzeit-Sync zwischen allen Beteiligten', 'Klient braucht keinen Account', 'Funktioniert im Browser auf jedem Gerät'],
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="#1F4045" strokeWidth="1.5"/>
                  <circle cx="12" cy="18" r="1" fill="#1F4045"/>
                </svg>
              ),
              title: 'Präsenz-Sitzung',
              desc: 'iPad auf den Tisch, Berater und Klient sitzen gemeinsam davor. Kein Tisch voller Holzfiguren — alles digital, Snapshots dokumentieren jede Phase.',
              features: ['Touch-optimiert für iPad', 'Offline-fähig — kein WLAN nötig', 'Automatisches Sitzungsprotokoll'],
            },
          ].map((card) => (
            <div key={card.title} style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid rgba(31,64,69,0.07)' }}
              className="hover:border-[#C9A96E]/30 transition-colors">
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(31,64,69,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1F4045', marginBottom: 12 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(26,26,26,0.52)', lineHeight: 1.65, marginBottom: 20 }}>{card.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {card.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'rgba(26,26,26,0.55)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="#C9A96E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features dark section */}
      <section id="funktionen" style={{ background: '#1F4045', padding: '80px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#C9A96E', marginBottom: 12 }}>FUNKTIONEN</p>
            <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', color: 'white' }}>Alles was die Praxis braucht</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '⬡', title: 'Personen-Figuren', desc: '10 semantische Farben: Rosa = Fürsorge, Rot = Konflikt, Grau = Distanz. Klient wählt intuitiv was passt.' },
              { icon: '↑', title: 'Blickrichtung', desc: 'Kompass N/S/O/W — zeigt an wen oder was eine Person schaut. Zentrales Werkzeug der systemischen Arbeit.' },
              { icon: '—', title: 'Beziehungslinien', desc: 'Verbindungen zwischen Figuren ziehen und wieder löschen. Zeigt Bindungen, Konflikte, Allianzen.' },
              { icon: '◎', title: 'Snapshots', desc: 'Aufstellungen speichern und vergleichen. Entwicklung über Sitzungen hinweg sichtbar machen.' },
              { icon: '✦', title: 'KI-Analyse', desc: 'Phänomenologische Beschreibung der Konstellation: Positionen, Nähe, Blickrichtungen — ohne Bewertung.' },
              { icon: '🔒', title: 'DSGVO-konform', desc: 'Server Frankfurt. Keine US-Cloud. Keine Datenweitergabe. Für sensible Beratungsdaten konzipiert.' },
            ].map((f) => (
              <div key={f.title} style={{ padding: 24, borderRadius: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                className="hover:bg-white/10 transition-colors">
                <div style={{ fontSize: 22, color: '#C9A96E', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI section */}
      <section id="ki" className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: '#C9A96E', marginBottom: 16 }}>KI-ANALYSE</p>
            <h2 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.025em', color: '#1F4045', marginBottom: 20, lineHeight: 1.2 }}>
              Die KI sieht —<br />ohne zu werten
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(26,26,26,0.52)', lineHeight: 1.7, marginBottom: 16 }}>
              Nach einer Aufstellung beschreibt die KI was sie phänomenologisch sieht: Nähe, Distanz, Blickrichtungen, Isolation. Keine Ratschläge, keine Diagnosen.
            </p>
            <p style={{ fontSize: 15, color: 'rgba(26,26,26,0.52)', lineHeight: 1.7 }}>
              Oder stell eine konkrete Frage: <em style={{ color: 'rgba(31,64,69,0.75)' }}>"Was fällt dir an der Position des Vaters auf?"</em>
            </p>
          </div>
          <div style={{ background: 'white', borderRadius: 24, padding: 28, border: '1px solid rgba(31,64,69,0.08)', boxShadow: '0 20px 60px rgba(31,64,69,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ color: '#C9A96E', fontSize: 18 }}>✦</span>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(31,64,69,0.5)' }}>KI-PERSPEKTIVE</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                '"Vater" steht am äußeren Rand und schaut nach außen — weg vom Zentrum und weg von "Kind".',
                '"Mutter" steht nah am Mittelpunkt, schaut auf "Kind". Zwischen beiden besteht eine direkte Verbindungslinie.',
                '"Kind" schaut in Richtung "Großmutter" — eine mögliche Ressourcen-Orientierung außerhalb der Elternachse.',
              ].map((s, i) => (
                <p key={i} style={{ fontSize: 13, color: 'rgba(26,26,26,0.62)', lineHeight: 1.65, paddingLeft: 14, borderLeft: '2px solid rgba(201,169,110,0.35)' }}>
                  {s}
                </p>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(26,26,26,0.28)', marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(31,64,69,0.07)' }}>
              Nur Phänomenologie — keine Interpretation, kein Ratschlag
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#F2EAD8', padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em', color: '#1F4045', marginBottom: 16 }}>
            Jetzt kostenlos testen
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(26,26,26,0.48)', marginBottom: 32, lineHeight: 1.6 }}>
            Voller Zugang während der Beta. Kein Abo, keine Kreditkarte.
            Dein Feedback formt das Produkt.
          </p>
          <Link href="/login"
            style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 100, background: '#1F4045', color: 'white', fontSize: 14, fontWeight: 500, boxShadow: '0 8px 24px rgba(31,64,69,0.22)' }}
            className="hover:opacity-90 transition-opacity">
            Figura starten →
          </Link>
          <p style={{ fontSize: 12, color: 'rgba(26,26,26,0.3)', marginTop: 16 }}>
            Für systemische Berater · Coaches · Therapeuten im DACH-Raum
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(31,64,69,0.08)', padding: '28px 32px' }}>
        <div style={{ maxWidth: 1024, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 68 80" fill="none">
              <circle cx="34" cy="24" r="14" fill="#1F4045" opacity="0.4"/>
              <path d="M10 62 C10 46 58 46 58 62 L58 74 C58 77 56 79 53 79 L15 79 C12 79 10 77 10 74 Z" fill="#1F4045" opacity="0.4"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(31,64,69,0.4)' }}>Figura · © 2026</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[['Datenschutz', '/datenschutz'], ['Impressum', '/impressum'], ['AGB', '/agb']].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: 12, color: 'rgba(26,26,26,0.35)' }} className="hover:text-black transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
