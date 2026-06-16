import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex flex-1 flex-col px-6 py-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1F4045]">
          Meine Sitzungen
        </h1>
      </div>
      <p className="text-muted-foreground">
        Noch keine Sitzungen vorhanden. Erstelle deine erste Sitzung nach dem
        Datenbank-Setup (M2).
      </p>
    </div>
  )
}
