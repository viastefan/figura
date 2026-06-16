import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ClientBoardView } from '@/components/board/client-board-view'

export default async function JoinPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()

  // Use service-role-like approach: query without RLS via a public API route
  // For now, use the anon key — the RLS policy blocks this.
  // We need an API route to validate the token and return session data.
  // Redirect to the API handler.

  return <ClientJoinWrapper token={token} />
}

function ClientJoinWrapper({ token }: { token: string }) {
  return <ClientBoardView token={token} />
}
