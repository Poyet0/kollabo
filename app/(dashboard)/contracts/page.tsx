import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { MoneyDisplay } from '@/components/ui/money-display'
import { CONTRACT_STATUS_LABELS } from '@/lib/utils'
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Contrats' }

const statusVariant: Record<string, 'gold' | 'success' | 'danger' | 'warning' | 'smoke'> = {
  pending_signatures: 'warning',
  active: 'gold',
  in_delivery: 'info' as never,
  completed: 'success',
  disputed: 'danger',
  cancelled: 'smoke',
}

export default async function ContractsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  const isCreator = profile?.user_type === 'creator'

  const { data: contracts } = await supabase
    .from('contracts')
    .select(`
      *,
      brand:brand_id(full_name, avatar_url),
      creator:creator_id(full_name, avatar_url),
      applications(campaigns(title))
    `)
    .or(isCreator ? `creator_id.eq.${user.id}` : `brand_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Contrats
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">{contracts?.length ?? 0} contrat{(contracts?.length ?? 0) > 1 ? 's' : ''}</p>
      </div>

      {!contracts || contracts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucun contrat pour l'instant"
          description={isCreator
            ? "Candidatez à des campagnes pour démarrer une collaboration."
            : "Publiez une campagne et acceptez des créateurs pour générer votre premier contrat."
          }
          action={{ label: isCreator ? 'Découvrir les campagnes' : 'Créer une campagne', href: isCreator ? '/discover' : '/campaigns/new' }}
        />
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => {
            const app = (contract.applications as Record<string, unknown>)
            const campaign = (app?.['campaigns'] as Record<string, unknown>)
            const counterpart = isCreator
              ? (contract.brand as Record<string, unknown>)
              : (contract.creator as Record<string, unknown>)

            return (
              <Link
                key={contract.id}
                href={`/contracts/${contract.id}`}
                className="flex items-center gap-4 rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 hover:border-[#C9A84C]/40 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-lg font-bold text-[#C9A84C] font-[family-name:var(--font-display)]">
                  {String(counterpart?.['full_name'] ?? '?').charAt(0)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-[#F5F2EA] truncate group-hover:text-[#C9A84C] transition-colors">
                    {campaign?.['title'] ? String(campaign['title']) : `Contrat #${contract.id.slice(0, 8)}`}
                  </p>
                  <p className="text-xs text-[#6B6B6B]">
                    avec {String(counterpart?.['full_name'] ?? 'Inconnu')} ·{' '}
                    {new Date(contract.created_at as string).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <MoneyDisplay amount={contract.agreed_price_xof as number} size="sm" variant="pearl" />
                  <Badge variant={statusVariant[contract.status as string] ?? 'smoke'}>
                    {CONTRACT_STATUS_LABELS[contract.status as string] ?? contract.status}
                  </Badge>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
