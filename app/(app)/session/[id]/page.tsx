import { BoardView } from '@/components/board/board-view'
import type { Session } from '@/types/database'

const DEMO_SESSIONS: Record<string, Session> = {
  'demo-1': {
    id: 'demo-1',
    owner_id: 'demo-user',
    title: 'Familie Müller – Systemaufstellung',
    client_token: 'demo-token-1',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  'demo-2': {
    id: 'demo-2',
    owner_id: 'demo-user',
    title: 'Coaching: Berufliche Neuorientierung',
    client_token: 'demo-token-2',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  'demo-3': {
    id: 'demo-3',
    owner_id: 'demo-user',
    title: 'Paarberatung – Erstgespräch',
    client_token: 'demo-token-3',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}

// Default fallback for any unknown session id
function getSession(id: string): Session {
  return DEMO_SESSIONS[id] ?? {
    id,
    owner_id: 'demo-user',
    title: 'Neue Sitzung',
    client_token: crypto.randomUUID(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = getSession(id)

  return (
    <BoardView
      session={session}
      initialFigures={[]}
      isOwner={true}
    />
  )
}
