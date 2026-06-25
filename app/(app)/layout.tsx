import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col min-h-screen" style={{ background: '#F7F3EE' }}>
      <header style={{
        borderBottom: '1px solid rgba(31,64,69,0.08)',
        background: 'rgba(247,243,238,0.95)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div className="flex items-center justify-between px-6 h-14 max-w-6xl mx-auto w-full">
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 68 80" fill="none">
              <circle cx="34" cy="24" r="14" fill="#1F4045"/>
              <path d="M10 62 C10 46 58 46 58 62 L58 74 C58 77 56 79 53 79 L15 79 C12 79 10 77 10 74 Z" fill="#1F4045"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: '#1F4045' }}>Figura</span>
          </Link>
          <div className="flex items-center gap-3">
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
              color: '#C9A96E', background: 'rgba(201,169,110,0.12)',
              border: '1px solid rgba(201,169,110,0.3)',
              padding: '3px 10px', borderRadius: 100,
            }}>BETA</span>
            <Link href="/" style={{ fontSize: 13, color: 'rgba(31,64,69,0.5)' }} className="hover:text-[#1F4045] transition-colors">
              Abmelden
            </Link>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
