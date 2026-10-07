'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { jitsiUrl } from '@/lib/jitsi'
import { useI18n } from '@/lib/i18n/client'
import type { Message } from '@/lib/types'

// Kisi bhi page pe: naya message ya incoming call aaye to popup dikhata hai.
export function GlobalNotifier() {
  const [userId, setUserId] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useI18n()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => setUserId(session?.user?.id ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`notify-${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const m = payload.new as Message
        if (m.sender_id === userId) return

        if (m.kind === 'call') {
          const mode = m.body === 'voice' ? 'voice' : 'video'
          toast(t('chat.incoming', { m: mode === 'voice' ? t('chat.voice') : t('chat.videoWord') }), {
            description: t('chat.joinDesc'),
            duration: 30000,
            action: {
              label: t('chat.join2'),
              onClick: () => window.open(jitsiUrl(m.conversation_id, mode), '_blank', 'noopener,noreferrer'),
            },
          })
          return
        }

        if (pathname?.startsWith(`/chat/${m.conversation_id}`)) return
        toast(t('chat.newMsg'), {
          description: m.body.slice(0, 80),
          action: { label: t('chat.open'), onClick: () => router.push(`/chat/${m.conversation_id}`) },
        })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, pathname, router, t])

  return null
}
