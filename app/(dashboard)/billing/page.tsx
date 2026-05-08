import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MoneyDisplay } from '@/components/ui/money-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Receipt, Download } from 'lucide-react'
import { calculateCommission } from '@/lib/utils'

export const metadata: Metadata = { title: 'Facturation' }

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: contracts } = await supabase
    .from('contracts')
    .select('*, applications(campaigns(title)), creator:creator_id(full_name)')
    .eq('brand_id', user.id)
    .in('status', ['completed', 'in_delivery', 'active'])
    .order('created_at', { ascending: false })

  const totalSpent = contracts?.reduce((sum, c) => sum + (c.agreed_price_xof ?? 0), 0) ?? 0
  const totalFees = contracts?.reduce((sum, c) => sum + (c.platform_fee_tva_xof ?? 0) + (c.platform_fee_xof ?? 0), 0) ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Facturation
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Factures KOLLABO et justificatifs comptables</p>
      </div>

      {/* Résumé */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Total dépensé', value: totalSpent, variant: 'pearl' as const },
          { label: 'Commissions KOLLABO (HT)', value: totalFees, variant: 'pearl' as const },
          { label: 'TVA collectée (18%)', value: Math.round(totalFees * 0.18 / 1.18), variant: 'pearl' as const },
        ].map((item) => (
          <div key={item.label} className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-6 space-y-2">
            <p className="text-sm text-[#6B6B6B]">{item.label}</p>
            <MoneyDisplay amount={item.value} size="xl" variant={item.variant} />
          </div>
        ))}
      </div>

      {/* Exports */}
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary-outline" size="md">
          <Download className="size-4" />
          Export CSV SYSCOHADA
        </Button>
        <Button variant="secondary-outline" size="md">
          <Download className="size-4" />
          Justificatifs RAS
        </Button>
      </div>

      {/* Factures */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
          Factures émises
        </h2>

        {!contracts || contracts.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Aucune facture"
            description="Vos factures KOLLABO apparaîtront ici après votre première campagne financée."
            action={{ label: 'Créer une campagne', href: '/campaigns/new' }}
          />
        ) : (
          <div className="rounded-[16px] border border-[#2A2A2A] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#6B6B6B]">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#6B6B6B]">Campagne</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#6B6B6B]">Créateur</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#6B6B6B]">Statut</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#6B6B6B]">Montant TTC</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => {
                  const app = contract.applications as Record<string, unknown>
                  const campaign = app?.['campaigns'] as Record<string, unknown>
                  const creator = contract.creator as Record<string, unknown>
                  const { commissionTTC } = calculateCommission(contract.agreed_price_xof)

                  return (
                    <tr key={contract.id} className="border-b border-[#2A2A2A] last:border-0 bg-[#1A1A1A] hover:bg-[#1A1A1A]/80">
                      <td className="px-5 py-3 text-[#6B6B6B]">
                        {new Date(contract.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-5 py-3 text-[#F5F2EA] max-w-[200px] truncate">
                        {campaign?.['title'] ? String(campaign['title']) : '—'}
                      </td>
                      <td className="px-5 py-3 text-[#6B6B6B]">
                        {creator?.['full_name'] ? String(creator['full_name']) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={contract.status === 'completed' ? 'success' : 'gold'}>
                          {contract.status === 'completed' ? 'Terminé' : 'En cours'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <MoneyDisplay amount={commissionTTC} size="sm" variant="gold" />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="ghost" size="icon-sm">
                          <Download className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
