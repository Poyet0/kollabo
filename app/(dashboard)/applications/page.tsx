import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import { MoneyDisplay } from '@/components/ui/money-display'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Mes candidatures' }

const statusVariant: Record<string, 'warning' | 'success' | 'danger' | 'smoke'> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'danger',
  withdrawn: 'smoke',
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  accepted: 'Acceptée',
  rejected: 'Refusée',
  withdrawn: 'Retirée',
}

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: applications } = await supabase
    .from('applications')
    .select('*, campaigns(title, budget_xof, status, brand_id)')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Mes candidatures
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">{applications?.length ?? 0} candidature{(applications?.length ?? 0) > 1 ? 's' : ''}</p>
      </div>

      {!applications || applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Aucune candidature"
          description="Explorez les campagnes disponibles et postulez à celles qui correspondent à votre profil."
          action={{ label: 'Découvrir les campagnes', href: '/discover' }}
        />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const campaign = app.campaigns as Record<string, unknown>
            return (
              <div
                key={app.id}
                className="flex items-center gap-4 rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-semibold text-[#F5F2EA] truncate">
                    {campaign?.['title'] ? String(campaign['title']) : 'Campagne sans titre'}
                  </p>
                  <div className="flex items-center gap-3">
                    <MoneyDisplay amount={app.proposed_price_xof} size="sm" variant="gold" />
                    <span className="text-xs text-[#6B6B6B]">proposé ·{' '}
                      {new Date(app.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  {app.pitch_text && (
                    <p className="text-xs text-[#6B6B6B] truncate max-w-lg">{app.pitch_text}</p>
                  )}
                </div>
                <Badge variant={statusVariant[app.status] ?? 'smoke'}>
                  {statusLabels[app.status] ?? app.status}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
