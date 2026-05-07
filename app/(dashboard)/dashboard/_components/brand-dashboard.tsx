import { Megaphone, Users, FileText, TrendingUp, Plus, CheckSquare } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { MoneyDisplay } from '@/components/ui/money-display'
import { formatFCFA } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'

interface BrandDashboardProps {
  profile: Record<string, unknown>
}

export function BrandDashboard({ profile }: BrandDashboardProps) {
  const bp = profile['brand_profiles'] as Record<string, unknown> | null
  const totalSpent = (bp?.['total_spent_xof'] as number) ?? 0
  const completedCampaigns = (bp?.['completed_campaigns'] as number) ?? 0

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
            Bonjour, {String(profile['full_name']).split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            {bp ? String(bp['company_name']) : 'Votre espace marque'}
          </p>
        </div>
        <Button variant="primary-gold" size="md" asChild>
          <Link href="/campaigns/new">
            <Plus className="size-4" />
            Nouvelle campagne
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Budget engagé ce mois"
          value={formatFCFA(totalSpent)}
          icon={TrendingUp}
          variant="gold"
        />
        <StatCard
          label="Campagnes actives"
          value={0}
          icon={Megaphone}
        />
        <StatCard
          label="Créateurs collaborés"
          value={completedCampaigns}
          icon={Users}
        />
        <StatCard
          label="Actions requises"
          value={0}
          icon={CheckSquare}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Actions requises */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions requises</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={CheckSquare}
                title="Aucune action en attente"
                description="Lancez votre première campagne pour collaborer avec des créateurs vérifiés."
                action={{ label: 'Créer une campagne', href: '/campaigns/new' }}
                className="border-0 bg-transparent py-8"
              />
            </CardContent>
          </Card>

          {/* Dernières factures */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dernières factures</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={FileText}
                title="Aucune facture"
                description="Vos factures KOLLABO apparaîtront ici une fois votre première campagne financée."
                className="border-0 bg-transparent py-8"
              />
            </CardContent>
          </Card>
        </div>

        {/* Créateurs recommandés */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Créateurs recommandés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Ange K.', niche: 'Lifestyle', followers: '35K', rating: 4.8 },
                { name: 'Fatou D.', niche: 'Beauté', followers: '128K', rating: 4.9 },
                { name: 'Moussa T.', niche: 'Tech', followers: '22K', rating: 4.7 },
              ].map((creator) => (
                <Link
                  key={creator.name}
                  href="/discover"
                  className="flex items-center gap-3 rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A]/50 p-3 hover:border-[#C9A84C]/30 transition-colors group"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A] text-xs font-semibold text-[#C9A84C]">
                    {creator.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-sm font-medium text-[#F5F2EA] group-hover:text-[#C9A84C] transition-colors">
                      {creator.name}
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      {creator.niche} · {creator.followers} · ⭐ {creator.rating}
                    </p>
                  </div>
                  <Badge variant="smoke" className="shrink-0">Voir</Badge>
                </Link>
              ))}

              <Button variant="ghost" size="sm" className="w-full mt-1" asChild>
                <Link href="/discover">Explorer tous les créateurs →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
