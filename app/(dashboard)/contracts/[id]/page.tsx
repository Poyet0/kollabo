import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoneyDisplay } from '@/components/ui/money-display'
import { Separator } from '@/components/ui/separator'
import { calculateCommission } from '@/lib/utils'
import {
  ArrowLeft, CheckCircle2, Clock, FileText, AlertCircle,
  Upload, MessageSquare, Download, Shield, User, Building2
} from 'lucide-react'

export const metadata: Metadata = { title: 'Détail du contrat' }

interface ContractRow {
  id: string
  agreed_price_xof: number
  platform_fee_xof: number | null
  platform_fee_tva_xof: number | null
  status: string
  created_at: string
  brand_id: string
  creator_id: string
  applications: {
    campaigns: {
      title: string | null
      description: string | null
      start_date: string | null
      end_date: string | null
    } | null
  } | null
  creator: { full_name: string | null; avatar_url: string | null } | null
  brand: { full_name: string | null } | null
}

const STATUS_CONFIG = {
  pending_payment: { label: 'En attente de paiement', color: 'warning' as const, icon: Clock },
  active: { label: 'Actif', color: 'success' as const, icon: CheckCircle2 },
  in_delivery: { label: 'Livrables en cours', color: 'gold' as const, icon: Upload },
  completed: { label: 'Terminé', color: 'success' as const, icon: CheckCircle2 },
  disputed: { label: 'Litige ouvert', color: 'danger' as const, icon: AlertCircle },
  cancelled: { label: 'Annulé', color: 'smoke' as const, icon: AlertCircle },
}

const TIMELINE_STEPS = [
  { key: 'signed', label: 'Contrat signé', desc: 'Les deux parties ont accepté les termes' },
  { key: 'funded', label: 'Escrow financé', desc: 'La marque a déposé les fonds en séquestre' },
  { key: 'delivery', label: 'Livrables soumis', desc: 'Le créateur a soumis son travail' },
  { key: 'validated', label: 'Livrables validés', desc: 'La marque a approuvé le contenu' },
  { key: 'paid', label: 'Paiement libéré', desc: 'Les fonds ont été versés au créateur' },
]

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: contract } = await supabase
    .from('contracts')
    .select(`
      *,
      applications(
        *,
        campaigns(title, description, start_date, end_date)
      ),
      creator:creator_id(full_name, avatar_url),
      brand:brand_id(full_name)
    `)
    .eq('id', id)
    .or(`creator_id.eq.${user.id},brand_id.eq.${user.id}`)
    .single()

  if (!contract) notFound()

  const c = contract as unknown as ContractRow
  const campaign = c.applications?.campaigns ?? null
  const creator = c.creator
  const brand = c.brand

  const isBrand = c.brand_id === user.id
  const agreedPrice = c.agreed_price_xof ?? 0
  const { commissionHT, tvaAmount, commissionTTC, creatorNet } = calculateCommission(agreedPrice)

  const statusConfig = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.active
  const StatusIcon = statusConfig.icon

  const currentStep = (() => {
    switch (c.status) {
      case 'pending_payment': return 0
      case 'active': return 1
      case 'in_delivery': return 2
      case 'completed': return 4
      default: return 1
    }
  })()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/contracts" className="mt-1 text-[#6B6B6B] hover:text-[#F5F2EA] transition-colors">
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
              {campaign?.title ?? 'Contrat'}
            </h1>
            <Badge variant={statusConfig.color}>
              <StatusIcon className="size-3" />
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Contrat #{id.slice(0, 8).toUpperCase()} · Signé le{' '}
            {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button variant="secondary-outline" size="sm">
          <Download className="size-3.5" />
          PDF
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-6">
            <h2 className="text-sm font-semibold text-[#F5F2EA] mb-5">Progression du contrat</h2>
            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const done = idx <= currentStep
                const active = idx === currentStep
                const isLast = idx === TIMELINE_STEPS.length - 1
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`size-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                        done
                          ? 'bg-[#C9A84C] border-[#C9A84C]'
                          : active
                          ? 'bg-transparent border-[#C9A84C]'
                          : 'bg-transparent border-[#2A2A2A]'
                      }`}>
                        {done && <CheckCircle2 className="size-3.5 text-[#0A0A0A]" />}
                      </div>
                      {!isLast && (
                        <div className={`w-0.5 h-8 mt-1 ${done && idx < currentStep ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'}`} />
                      )}
                    </div>
                    <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                      <p className={`text-sm font-medium ${done ? 'text-[#F5F2EA]' : 'text-[#6B6B6B]'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {campaign?.description != null && (
            <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-6 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#C9A84C]" />
                <h2 className="text-sm font-semibold text-[#F5F2EA]">Brief de campagne</h2>
              </div>
              <p className="text-sm text-[#B0B0B0] leading-relaxed whitespace-pre-line">
                {campaign.description}
              </p>
            </div>
          )}

          {/* Escrow status */}
          <div className="rounded-[16px] border border-[#C9A84C]/20 bg-[rgba(201,168,76,0.04)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="size-4 text-[#C9A84C]" />
              <h2 className="text-sm font-semibold text-[#F5F2EA]">Séquestre (Escrow)</h2>
            </div>
            <p className="text-xs text-[#6B6B6B]">
              Les fonds sont sécurisés par KOLLABO jusqu&apos;à validation des livrables. Ils ne peuvent être ni réclamés par la marque, ni utilisés par le créateur avant la libération.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[10px] bg-[#1A1A1A] border border-[#2A2A2A] p-3 space-y-1">
                <p className="text-xs text-[#6B6B6B]">Montant séquestré</p>
                <MoneyDisplay amount={agreedPrice} size="md" variant="gold" />
              </div>
              <div className="rounded-[10px] bg-[#1A1A1A] border border-[#2A2A2A] p-3 space-y-1">
                <p className="text-xs text-[#6B6B6B]">Statut</p>
                <p className="text-sm font-semibold text-[#4A8B5C]">
                  {c.status === 'completed' ? 'Libéré ✓' : 'En séquestre'}
                </p>
              </div>
            </div>
            {c.status === 'in_delivery' && !isBrand && (
              <Button variant="primary-gold" size="md" className="w-full">
                <Upload className="size-4" />
                Soumettre les livrables
              </Button>
            )}
            {c.status === 'in_delivery' && isBrand && (
              <div className="flex gap-3">
                <Button variant="primary-gold" size="md" className="flex-1">
                  <CheckCircle2 className="size-4" />
                  Valider les livrables
                </Button>
                <Button variant="danger-outline" size="md">
                  Demander correction
                </Button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary-outline" size="md" className="gap-2">
              <MessageSquare className="size-4" />
              Ouvrir la messagerie
            </Button>
            {c.status === 'active' || c.status === 'in_delivery' ? (
              <Button variant="danger-outline" size="md">
                Signaler un litige
              </Button>
            ) : null}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Parties */}
          <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#F5F2EA]">Parties au contrat</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-[#2A2A2A] flex items-center justify-center shrink-0">
                  <Building2 className="size-4 text-[#6B6B6B]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B6B6B]">Marque</p>
                  <p className="text-sm text-[#F5F2EA]">{brand?.full_name ?? '—'}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-[#2A2A2A] flex items-center justify-center shrink-0">
                  <User className="size-4 text-[#6B6B6B]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B6B6B]">Créateur</p>
                  <p className="text-sm text-[#F5F2EA]">{creator?.full_name ?? '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial breakdown */}
          <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#F5F2EA]">Répartition financière</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Budget brut</span>
                <MoneyDisplay amount={agreedPrice} size="sm" variant="pearl" />
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Commission KOLLABO (HT)</span>
                <MoneyDisplay amount={commissionHT} size="sm" variant="pearl" />
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">TVA 18%</span>
                <MoneyDisplay amount={tvaAmount} size="sm" variant="pearl" />
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-[#6B6B6B]">Commission TTC</span>
                <MoneyDisplay amount={commissionTTC} size="sm" variant="gold" />
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-[#4A8B5C]">Créateur perçoit</span>
                <MoneyDisplay amount={creatorNet} size="sm" variant="pearl" />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6B6B6B]">RAS 7,5% (Art. 56 CGI)</span>
                <span className="text-[#6B6B6B]">−{Math.round(creatorNet * 0.075).toLocaleString('fr-FR')} F</span>
              </div>
            </div>
          </div>

          {(campaign?.start_date != null || campaign?.end_date != null) && (
            <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#F5F2EA]">Calendrier</h3>
              <div className="space-y-2 text-sm">
                {campaign?.start_date != null && (
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Début</span>
                    <span className="text-[#F5F2EA]">
                      {new Date(campaign.start_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
                {campaign?.end_date != null && (
                  <div className="flex justify-between">
                    <span className="text-[#6B6B6B]">Fin</span>
                    <span className="text-[#F5F2EA]">
                      {new Date(campaign.end_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
