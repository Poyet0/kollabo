import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MoneyDisplay } from '@/components/ui/money-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Wallet, ArrowDownRight, Download, Clock } from 'lucide-react'

export const metadata: Metadata = { title: 'Mon portefeuille' }

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('creator_id', user.id)
    .single()

  const { data: payouts } = await supabase
    .from('payouts')
    .select('*')
    .eq('wallet_id', wallet?.id ?? '')
    .order('created_at', { ascending: false })
    .limit(20)

  const available = wallet?.available_balance_xof ?? 0
  const pending = wallet?.pending_balance_xof ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Mon portefeuille
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Gérez vos revenus et retraits</p>
      </div>

      {/* Soldes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-[24px] border border-[#C9A84C]/30 bg-[rgba(201,168,76,0.06)] p-8 space-y-3">
          <p className="text-sm text-[#6B6B6B] font-medium">Solde disponible</p>
          <MoneyDisplay amount={available} size="2xl" variant="gold" />
          <Button variant="primary-gold" size="lg" className="mt-2" disabled={available === 0}>
            <ArrowDownRight className="size-4" />
            Retirer mes fonds
          </Button>
        </div>

        <div className="rounded-[24px] border border-[#2A2A2A] bg-[#1A1A1A] p-8 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-[#6B6B6B]" />
            <p className="text-sm text-[#6B6B6B] font-medium">En attente de libération</p>
          </div>
          <MoneyDisplay amount={pending} size="2xl" variant="pearl" />
          <p className="text-xs text-[#6B6B6B]">
            Libération automatique 7 jours après soumission des livrables si la marque ne valide pas.
          </p>
        </div>
      </div>

      {/* Export fiscal */}
      <div className="rounded-[16px] border border-[#C9A84C]/20 bg-[rgba(201,168,76,0.04)] p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#F5F2EA]">Récapitulatif fiscal annuel</p>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Document PDF prêt pour votre déclaration BNC (impôts ivoiriens)
          </p>
        </div>
        <Button variant="secondary-outline" size="md">
          <Download className="size-4" />
          Télécharger 2026
        </Button>
      </div>

      {/* Historique */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
          Historique des transactions
        </h2>

        {!payouts || payouts.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Aucune transaction"
            description="Vos retraits et paiements reçus apparaîtront ici."
          />
        ) : (
          <div className="rounded-[16px] border border-[#2A2A2A] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#6B6B6B]">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#6B6B6B]">Méthode</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[#6B6B6B]">Statut</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-[#6B6B6B]">Montant</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((payout, i) => (
                  <tr
                    key={payout.id}
                    className={`border-b border-[#2A2A2A] last:border-0 ${i % 2 === 0 ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]/50'}`}
                  >
                    <td className="px-5 py-3 text-[#6B6B6B]">
                      {new Date(payout.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-5 py-3 text-[#F5F2EA] capitalize">{payout.method.replace('_', ' ')}</td>
                    <td className="px-5 py-3">
                      <Badge variant={payout.status === 'completed' ? 'success' : payout.status === 'failed' ? 'danger' : 'warning'}>
                        {payout.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <MoneyDisplay amount={payout.amount_xof} size="sm" variant="gold" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
