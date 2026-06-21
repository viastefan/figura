import Link from 'next/link'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 h-14 max-w-6xl mx-auto w-full">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-[#1F4045]">
            Figura
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground bg-[#C9A96E]/15 px-2.5 py-1 rounded-full">
              Demo
            </span>
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Abmelden
            </Link>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}
