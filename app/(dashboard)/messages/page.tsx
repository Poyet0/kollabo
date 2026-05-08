import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/empty-state'
import { MessageSquare } from 'lucide-react'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  const isCreator = profile?.user_type === 'creator'

  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      *,
      contracts(agreed_price_xof, status, applications(campaigns(title))),
      brand:brand_id(full_name, avatar_url),
      creator:creator_id(full_name, avatar_url)
    `)
    .or(isCreator ? `creator_id.eq.${user.id}` : `brand_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Messages
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">{conversations?.length ?? 0} conversation{(conversations?.length ?? 0) > 1 ? 's' : ''}</p>
      </div>

      {!conversations || conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Aucun message"
          description="Vos échanges avec les créateurs/marques apparaîtront ici une fois un contrat signé."
        />
      ) : (
        <div className="flex gap-6 flex-1 min-h-0">
          {/* Liste conversations */}
          <div className="w-80 shrink-0 space-y-2 overflow-y-auto">
            {conversations.map((conv) => {
              const counterpart = isCreator
                ? (conv.brand as Record<string, unknown>)
                : (conv.creator as Record<string, unknown>)
              const contract = conv.contracts as Record<string, unknown>
              const app = contract?.['applications'] as Record<string, unknown>
              const campaign = app?.['campaigns'] as Record<string, unknown>

              return (
                <div
                  key={conv.id}
                  className="flex items-start gap-3 rounded-[12px] border border-[#2A2A2A] bg-[#1A1A1A] p-4 cursor-pointer hover:border-[#C9A84C]/30 transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-sm font-bold text-[#C9A84C]">
                    {String(counterpart?.['full_name'] ?? '?').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F5F2EA] truncate">
                      {String(counterpart?.['full_name'] ?? 'Inconnu')}
                    </p>
                    <p className="text-xs text-[#6B6B6B] truncate">
                      {campaign?.['title'] ? String(campaign['title']) : 'Collaboration'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Zone message vide */}
          <div className="flex-1 rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] flex items-center justify-center">
            <div className="text-center space-y-2">
              <MessageSquare className="size-8 text-[#6B6B6B] mx-auto" />
              <p className="text-sm text-[#6B6B6B]">Sélectionnez une conversation</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
