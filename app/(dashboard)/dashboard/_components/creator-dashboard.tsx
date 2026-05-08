import { Wallet, FileText, Star, TrendingUp, Clock, MessageSquare, Zap } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { MoneyDisplay } from '@/components/ui/money-display'
import { formatFCFA } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'

interface CreatorDashboardProps {
  profile: Record<string, unknown>
}

export function CreatorDashboard({ profile }: CreatorDashboardProps) {
  const cp = profile['creator_profiles'] as Record<string, unknown> | null
  const availableBalance = (cp?.['available_balance_xof'] as number) ?? 0
  const pendingBalance = (cp?.['pending_balance_xof'] as number) ?? 0
  const ratingAvg = (cp?.['rating_avg'] as number) ?? 0
  const completedCampaigns = (cp?.['completed_campaigns'] as number) ?? 0

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
            Bonjour, {String(profile['full_name']).split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">Voici votre tableau de bord</p>
        </div>
        <Button variant="primary-gold" size="md" asChild>
          <Link href="/discover">
            <Zap className="size-4" />
            Découvrir des campagnes
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Solde disponible"
          value={formatFCFA(availableBalance)}
          icon={Wallet}
          variant="gold"
        />
        <StatCard
          label="En attente de libération"
          value={formatFCFA(pendingBalance)}
          icon={Clock}
        />
        <StatCard
          label="Contrats en cours"
          value={0}
          icon={FileText}
          change={0}
        />
        <StatCard
          label="Note moyenne"
          value={ratingAvg ? `${Number(ratingAvg).toFixed(1)} / 5` : '—'}
          icon={Star}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* À faire aujourd'hui */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">À faire aujourd&apos;hui</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={FileText}
                title="Tout est à jour"
                description="Aucune action urgente. Profitez-en pour explorer de nouvelles campagnes."
                className="border-0 bg-transparent py-8"
              />
            </CardContent>
          </Card>

          {/* Graphique revenus */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenus — 6 derniers mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 flex items-center justify-center">
                <p className="text-sm text-[#6B6B6B]">
                  Complétez votre première campagne pour voir vos revenus ici.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opportunités */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Opportunités pour vous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: 'Campagne beauté été', budget: 150000, deadline: '15 mai' },
                { title: 'Lancement app mobile', budget: 300000, deadline: '20 mai' },
                { title: 'Mode Ramadan CI', budget: 200000, deadline: '25 mai' },
              ].map((opp) => (
                <Link
                  key={opp.title}
                  href="/discover"
                  className="flex items-start gap-3 rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A]/50 p-3 hover:border-[#C9A84C]/30 transition-colors group"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium text-[#F5F2EA] truncate group-hover:text-[#C9A84C] transition-colors">
                      {opp.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <MoneyDisplay amount={opp.budget} size="sm" variant="gold" />
                      <span className="text-xs text-[#6B6B6B]">· {opp.deadline}</span>
                    </div>
                  </div>
                  <Badge variant="gold" className="shrink-0">Nouveau</Badge>
                </Link>
              ))}

              <Button variant="ghost" size="sm" className="w-full mt-1" asChild>
                <Link href="/discover">Voir toutes les campagnes →</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Stats réseau */}
          {completedCampaigns > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Votre performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#6B6B6B]">{completedCampaigns} campagnes terminées</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
