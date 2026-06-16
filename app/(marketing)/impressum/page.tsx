import Link from 'next/link'

export default function ImpressumPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        &larr; Zurück
      </Link>
      <h1 className="text-2xl font-semibold mt-4 mb-6 text-[#1F4045]">Impressum</h1>
      <p className="text-muted-foreground">Platzhalter — Impressum wird vor Go-Live ergänzt.</p>
    </div>
  )
}
