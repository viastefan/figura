import { BoardView } from '@/components/board/board-view'
import type { Session } from '@/types/database'

function getSession(id: string): Session {
  const titles: Record<string, string> = {
    'demo-1': 'Familie Müller – Systemaufstellung',
    'demo-2': 'Coaching: Berufliche Neuorientierung',
    'demo-3': 'Paarberatung – Erstgespräch',
  }
  return {
    id,
    owner_id: 'demo-user',
    title: titles[id] ?? 'Neue Sitzung',
    client_token: 'demo',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = getSession(id)
  return <BoardView session={session} initialFigures={[]} isOwner={true} />
}
