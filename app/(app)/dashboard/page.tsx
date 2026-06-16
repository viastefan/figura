import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SessionList } from '@/components/session-list'
import { CreateSessionButton } from '@/components/create-session-button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .order('updated_at', { ascending: false })

  return (
    <div className="flex flex-1 flex-col px-6 py-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1F4045]">
          Meine Sitzungen
        </h1>
        <CreateSessionButton />
      </div>
      <SessionList sessions={sessions ?? []} />
    </div>
  )
}
