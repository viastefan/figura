import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('*')
    .eq('client_token', token)
    .eq('status', 'active')
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const { data: figures } = await supabaseAdmin
    .from('figures')
    .select('*')
    .eq('session_id', session.id)
    .order('z_index', { ascending: true })

  return NextResponse.json({
    session,
    figures: figures ?? [],
  })
}
