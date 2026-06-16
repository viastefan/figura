'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function CreateSessionButton() {
  const router = useRouter()

  async function handleCreate() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('sessions')
      .insert({ title: 'Neue Sitzung' })
      .select()
      .single()

    if (error || !data) return

    router.push(`/session/${data.id}`)
  }

  return (
    <Button onClick={handleCreate} className="bg-[#1F4045] hover:bg-[#1F4045]/90">
      Neue Sitzung
    </Button>
  )
}
