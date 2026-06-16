import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <Link href="/" className="text-xl font-semibold tracking-tight text-[#1F4045]">
          Figura
        </Link>
        <Link href="/login">
          <Button variant="outline" size="sm">
            Anmelden
          </Button>
        </Link>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-[#1F4045] sm:text-5xl">
            Das digitale Systembrett
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Figura bringt das klassische Systembrett in deine Online-Sitzungen.
            Platziere Figuren, arbeite in Echtzeit mit Klient:innen, und
            dokumentiere Veränderung durch Snapshots.
          </p>
          <p className="text-sm text-muted-foreground">
            Für systemische Berater:innen, Coaches und Therapeut:innen im
            DACH-Raum. DSGVO-konform, EU-gehostet.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/login">
              <Button className="bg-[#1F4045] hover:bg-[#1F4045]/90">
                Jetzt starten
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Figura</span>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:underline">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:underline">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:underline">
              AGB
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
