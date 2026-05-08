'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { calculateCommission, formatFCFA, cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Brief', 'Livrables', 'Budget & cible', 'Récap']

const NICHES = ['mode','beaute','lifestyle','food','tech','gaming','sport','business','parenting','voyage','art','musique','humour','education']
const NICHE_LABELS: Record<string, string> = {
  mode: 'Mode', beaute: 'Beauté', lifestyle: 'Lifestyle', food: 'Food',
  tech: 'Tech', gaming: 'Gaming', sport: 'Sport', business: 'Business',
  parenting: 'Parentalité', voyage: 'Voyage', art: 'Art', musique: 'Musique',
  humour: 'Humour', education: 'Éducation',
}

const DELIVERABLE_TYPES = ['post','story','reel','video','thread']
const DELIVERABLE_LABELS: Record<string, string> = {
  post: 'Post statique', story: 'Story', reel: 'Reel', video: 'Vidéo longue', thread: 'Thread'
}

interface CampaignFormData {
  title: string
  briefMd: string
  budget: string
  startDate: string
  endDate: string
  minFollowers: string
  niches: string[]
  deliverables: Array<{ type: string; platform: string; quantity: number; description: string }>
}

export function NewCampaignForm({ brandId }: { brandId: string }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<CampaignFormData>({
    title: '',
    briefMd: '',
    budget: '',
    startDate: '',
    endDate: '',
    minFollowers: '',
    niches: [],
    deliverables: [{ type: 'reel', platform: 'instagram', quantity: 1, description: '' }],
  })

  const budget = parseInt(data.budget) || 0
  const commission = budget > 0 ? calculateCommission(budget) : null

  async function handlePublish() {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const { data: campaign, error: err } = await supabase
      .from('campaigns')
      .insert({
        brand_id: brandId,
        title: data.title,
        brief_md: data.briefMd,
        budget_xof: budget,
        deliverables: data.deliverables,
        niche_targeted: data.niches,
        min_followers: data.minFollowers ? parseInt(data.minFollowers) : null,
        start_date: data.startDate || new Date().toISOString(),
        end_date: data.endDate || new Date(Date.now() + 30 * 86400000).toISOString(),
        status: 'open',
      })
      .select('id')
      .single()

    if (err) {
      setError('Erreur lors de la publication.')
      setLoading(false)
      return
    }

    router.push('/campaigns')
    router.refresh()
  }

  function toggleNiche(niche: string) {
    setData(prev => ({
      ...prev,
      niches: prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : [...prev.niches, niche]
    }))
  }

  function addDeliverable() {
    setData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, { type: 'post', platform: 'instagram', quantity: 1, description: '' }]
    }))
  }

  function updateDeliverable(i: number, field: string, value: string | number) {
    setData(prev => {
      const d = [...prev.deliverables]
      d[i] = { ...d[i]!, [field]: value }
      return { ...prev, deliverables: d }
    })
  }

  function removeDeliverable(i: number) {
    setData(prev => ({ ...prev, deliverables: prev.deliverables.filter((_, idx) => idx !== i) }))
  }

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="space-y-3">
        <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9A84C] rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <div className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                i < step ? 'bg-[#4A8B5C] text-white' : i === step ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'bg-[#2A2A2A] text-[#6B6B6B]'
              )}>
                {i < step ? <Check className="size-3" /> : i + 1}
              </div>
              <span className={cn('text-xs hidden sm:block', i === step ? 'text-[#F5F2EA] font-medium' : 'text-[#6B6B6B]')}>{s}</span>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-[#2A2A2A] mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Étape 1 : Brief */}
      {step === 0 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">Le brief de la campagne</h2>
            <Input
              label="Titre de la campagne"
              placeholder="Lancement crème Eclat Premium — été 2026"
              value={data.title}
              onChange={e => setData(p => ({ ...p, title: e.target.value }))}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#F5F2EA]">Brief détaillé <span className="text-[#6B6B6B]">(Markdown accepté)</span></label>
              <textarea
                className="flex min-h-[200px] w-full rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm text-[#F5F2EA] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 resize-y transition-colors font-mono"
                placeholder={`## Objectif\nAugmenter la notoriété de notre nouvelle crème éclat...\n\n## Ton souhaité\nNaturel, authentique, proximité avec l'audience...\n\n## Guidelines\n- Mentionner le hashtag #EclatPremium\n- Taguer @cosmeticsci\n- Phrase imposée : "Ma peau, ma fierté"`}
                value={data.briefMd}
                onChange={e => setData(p => ({ ...p, briefMd: e.target.value }))}
              />
            </div>
            <Button
              variant="primary-gold" size="lg"
              onClick={() => setStep(1)}
              disabled={!data.title.trim() || !data.briefMd.trim()}
              className="w-full"
            >
              Continuer <ChevronRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Étape 2 : Livrables */}
      {step === 1 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">Les livrables attendus</h2>
            <div className="space-y-3">
              {data.deliverables.map((d, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_80px_auto] gap-2 items-end">
                  <div className="flex flex-col gap-1">
                    {i === 0 && <label className="text-xs font-medium text-[#6B6B6B]">Type</label>}
                    <select
                      className="h-10 rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A] px-3 text-sm text-[#F5F2EA] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      value={d.type}
                      onChange={e => updateDeliverable(i, 'type', e.target.value)}
                    >
                      {DELIVERABLE_TYPES.map(t => <option key={t} value={t}>{DELIVERABLE_LABELS[t]}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    {i === 0 && <label className="text-xs font-medium text-[#6B6B6B]">Plateforme</label>}
                    <select
                      className="h-10 rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A] px-3 text-sm text-[#F5F2EA] focus:outline-none focus:border-[#C9A84C] transition-colors"
                      value={d.platform}
                      onChange={e => updateDeliverable(i, 'platform', e.target.value)}
                    >
                      {['instagram','tiktok','youtube'].map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    {i === 0 && <label className="text-xs font-medium text-[#6B6B6B]">Qté</label>}
                    <input
                      type="number"
                      min={1}
                      max={50}
                      className="h-10 rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A] px-3 text-sm text-[#F5F2EA] focus:outline-none focus:border-[#C9A84C] text-center transition-colors"
                      value={d.quantity}
                      onChange={e => updateDeliverable(i, 'quantity', parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeDeliverable(i)}
                    disabled={data.deliverables.length === 1}
                    className={i === 0 ? 'self-end' : ''}
                  >
                    <Trash2 className="size-3.5 text-[#B84545]" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={addDeliverable}>
              <Plus className="size-4" /> Ajouter un livrable
            </Button>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" size="lg" onClick={() => setStep(0)} className="flex-1">
                <ChevronLeft className="size-4" /> Retour
              </Button>
              <Button variant="primary-gold" size="lg" onClick={() => setStep(2)} className="flex-1">
                Continuer <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 3 : Budget & cible */}
      {step === 2 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">Budget & audience cible</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                label="Budget total (FCFA)"
                placeholder="250 000"
                value={data.budget}
                onChange={e => setData(p => ({ ...p, budget: e.target.value }))}
                suffix={<span className="text-xs text-[#6B6B6B]">F</span>}
                required
              />
              <Input
                type="number"
                label="Abonnés minimum"
                placeholder="5 000"
                value={data.minFollowers}
                onChange={e => setData(p => ({ ...p, minFollowers: e.target.value }))}
              />
              <Input
                type="date"
                label="Date de début"
                value={data.startDate}
                onChange={e => setData(p => ({ ...p, startDate: e.target.value }))}
              />
              <Input
                type="date"
                label="Date de fin"
                value={data.endDate}
                onChange={e => setData(p => ({ ...p, endDate: e.target.value }))}
              />
            </div>

            {/* Niches ciblées */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#F5F2EA]">Niches ciblées</label>
              <div className="flex flex-wrap gap-2">
                {NICHES.map(niche => {
                  const isSelected = data.niches.includes(niche)
                  return (
                    <button
                      key={niche}
                      onClick={() => toggleNiche(niche)}
                      className={cn('text-sm rounded-[10px] px-3 py-1.5 border transition-colors',
                        isSelected ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                        : 'border-[#2A2A2A] bg-[#2A2A2A] text-[#6B6B6B] hover:border-[#C9A84C]/40'
                      )}
                    >
                      {NICHE_LABELS[niche]}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Aperçu commission */}
            {commission && (
              <div className="rounded-[12px] border border-[#C9A84C]/20 bg-[rgba(201,168,76,0.04)] p-4 space-y-2">
                <p className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider">Récap financier</p>
                <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                  <span className="text-[#6B6B6B]">Budget brut</span>
                  <span className="text-[#F5F2EA] text-right font-mono">{formatFCFA(budget)}</span>
                  <span className="text-[#6B6B6B]">Commission KOLLABO HT ({Math.round(commission.rate * 100)}%)</span>
                  <span className="text-[#F5F2EA] text-right font-mono">{formatFCFA(commission.commissionHT)}</span>
                  <span className="text-[#6B6B6B]">TVA 18%</span>
                  <span className="text-[#F5F2EA] text-right font-mono">{formatFCFA(commission.tvaAmount)}</span>
                  <span className="text-[#C9A84C] font-semibold">Créateur perçoit</span>
                  <span className="text-[#C9A84C] text-right font-mono font-semibold">{formatFCFA(commission.creatorNet)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="secondary" size="lg" onClick={() => setStep(1)} className="flex-1">
                <ChevronLeft className="size-4" /> Retour
              </Button>
              <Button
                variant="primary-gold" size="lg"
                onClick={() => setStep(3)}
                disabled={!data.budget || budget < 10000}
                className="flex-1"
              >
                Voir le récap <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 4 : Récap & publication */}
      {step === 3 && (
        <Card>
          <CardContent className="pt-6 space-y-6">
            <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">Récapitulatif</h2>

            <div className="space-y-4">
              <div className="rounded-[12px] border border-[#2A2A2A] bg-[#1A1A1A]/50 p-4 space-y-2">
                <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Brief</p>
                <p className="text-base font-semibold text-[#F5F2EA]">{data.title}</p>
                <p className="text-sm text-[#6B6B6B] line-clamp-3">{data.briefMd}</p>
              </div>

              <div className="rounded-[12px] border border-[#2A2A2A] bg-[#1A1A1A]/50 p-4 space-y-2">
                <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Livrables</p>
                <div className="flex flex-wrap gap-2">
                  {data.deliverables.map((d, i) => (
                    <span key={i} className="text-xs rounded-[6px] border border-[#2A2A2A] bg-[#2A2A2A] px-2.5 py-1 text-[#F5F2EA]">
                      {d.quantity}× {DELIVERABLE_LABELS[d.type]} ({d.platform})
                    </span>
                  ))}
                </div>
              </div>

              {commission && (
                <div className="rounded-[12px] border border-[#C9A84C]/20 bg-[rgba(201,168,76,0.06)] p-4 space-y-2">
                  <p className="text-xs font-medium text-[#C9A84C] uppercase tracking-wider">Budget</p>
                  <p className="text-2xl font-bold text-[#C9A84C] font-mono">{formatFCFA(budget)}</p>
                  <p className="text-xs text-[#6B6B6B]">
                    Créateur net : <span className="text-[#F5F2EA] font-semibold">{formatFCFA(commission.creatorNet)}</span>
                    {' · '}Commission KOLLABO TTC : <span className="text-[#F5F2EA]">{formatFCFA(commission.commissionTTC)}</span>
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-[10px] border border-[#B84545]/30 bg-[rgba(184,69,69,0.08)] px-4 py-3">
                <p className="text-sm text-[#B84545]">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={() => setStep(2)} className="flex-1">
                <ChevronLeft className="size-4" /> Retour
              </Button>
              <Button
                variant="primary-gold" size="lg"
                onClick={handlePublish}
                loading={loading}
                className="flex-1"
              >
                Publier la campagne 🚀
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
