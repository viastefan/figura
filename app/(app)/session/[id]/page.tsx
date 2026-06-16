import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BoardView } from '@/components/board/board-view'

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!session || session.owner_id !== user.id) redirect('/dashboard')

  const { data: figures } = await supabase
    .from('figures')
    .select('*')
    .eq('session_id', id)
    .order('z_index', { ascending: true })

  return (
    <BoardView
      session={session}
      initialFigures={figures ?? []}
      isOwner={true}
    />
  )
}
