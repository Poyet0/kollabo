'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, ChevronRight, ChevronLeft, Instagram, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Identité', 'Niches', 'Réseaux sociaux', 'Tarifs', 'KYC']

const NICHES = [
  { value: 'mode', label: 'Mode' },
  { value: 'beaute', label: 'Beauté' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'food', label: 'Food' },
  { value: 'tech', label: 'Tech' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'sport', label: 'Sport' },
  { value: 'business', label: 'Business' },
  { value: 'parenting', label: 'Parentalité' },
  { value: 'voyage', label: 'Voyage' },
  { value: 'art', label: 'Art' },
  { value: 'musique', label: 'Musique' },
  { value: 'humour', label: 'Humour' },
  { value: 'education', label: 'Éducation' },
]

interface OnboardingFlowProps {
  profile: Record<string, unknown>
  currentStep: number
}

export function OnboardingCreatorFlow({ profile, currentStep }: OnboardingFlowProps) {
  const router = useRouter()
  const [step, setStep] = useState(currentStep)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // State partagé entre toutes les étapes
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    city: '',
    niches: [] as string[],
    instagramHandle: '',
    tiktokHandle: '',
    youtubeHandle: '',
    baseRatePost: '',
    baseRateStory: '',
    baseRateReel: '',
    baseRateVideo: '',
    ribWave: '',
    ribOrangeMoney: '',
  })

  async function saveStep(nextStep: number, extraData?: Record<string, unknown>) {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      // Met à jour le step dans profiles
      await supabase
        .from('profiles')
        .update({ onboarding_step: nextStep, ...(extraData?.profileUpdate ?? {}) })
        .eq('id', profile['id'])

      // Met à jour creator_profiles si nécessaire
      if (extraData?.creatorUpdate) {
        await supabase
          .from('creator_profiles')
          .update(extraData.creatorUpdate)
          .eq('profile_id', profile['id'])
      }

      setStep(nextStep)
    } catch {
      setError('Erreur lors de la sauvegarde. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  async function completeOnboarding() {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true, onboarding_step: 5 })
        .eq('id', profile['id'])

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Erreur lors de la finalisation.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
            Configurer mon profil créateur
          </h1>
          <span className="text-sm text-[#6B6B6B]">
            {step + 1} / {STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9A84C] rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Étapes */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  i < step
                    ? 'bg-[#4A8B5C] text-white'
                    : i === step
                    ? 'bg-[#C9A84C] text-[#0A0A0A]'
                    : 'bg-[#2A2A2A] text-[#6B6B6B]',
                )}
              >
                {i < step ? <Check className="size-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-xs hidden sm:block',
                  i === step ? 'text-[#F5F2EA] font-medium' : 'text-[#6B6B6B]',
                )}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-[#2A2A2A] mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div className="rounded-[24px] border border-[#2A2A2A] bg-[#1A1A1A] p-8">
        {step === 0 && (
          <StepIdentite
            displayName={formData.displayName}
            bio={formData.bio}
            city={formData.city}
            onChange={(d) => setFormData((prev) => ({ ...prev, ...d }))}
            onNext={() =>
              saveStep(1, {
                profileUpdate: { city: formData.city },
                creatorUpdate: { display_name: formData.displayName || profile['full_name'], bio: formData.bio },
              })
            }
            loading={loading}
          />
        )}

        {step === 1 && (
          <StepNiches
            selectedNiches={formData.niches}
            onChange={(niches) => setFormData((prev) => ({ ...prev, niches }))}
            onNext={() =>
              saveStep(2, { creatorUpdate: { niche: formData.niches } })
            }
            onBack={() => setStep(0)}
            loading={loading}
          />
        )}

        {step === 2 && (
          <StepReseaux
            instagramHandle={formData.instagramHandle}
            tiktokHandle={formData.tiktokHandle}
            youtubeHandle={formData.youtubeHandle}
            onChange={(d) => setFormData((prev) => ({ ...prev, ...d }))}
            onNext={() =>
              saveStep(3, {
                creatorUpdate: {
                  instagram_handle: formData.instagramHandle || null,
                  tiktok_handle: formData.tiktokHandle || null,
                  youtube_handle: formData.youtubeHandle || null,
                },
              })
            }
            onBack={() => setStep(1)}
            loading={loading}
          />
        )}

        {step === 3 && (
          <StepTarifs
            baseRatePost={formData.baseRatePost}
            baseRateStory={formData.baseRateStory}
            baseRateReel={formData.baseRateReel}
            baseRateVideo={formData.baseRateVideo}
            onChange={(d) => setFormData((prev) => ({ ...prev, ...d }))}
            onNext={() =>
              saveStep(4, {
                creatorUpdate: {
                  base_rate_post: formData.baseRatePost ? parseInt(formData.baseRatePost) : null,
                  base_rate_story: formData.baseRateStory ? parseInt(formData.baseRateStory) : null,
                  base_rate_reel: formData.baseRateReel ? parseInt(formData.baseRateReel) : null,
                  base_rate_video: formData.baseRateVideo ? parseInt(formData.baseRateVideo) : null,
                },
              })
            }
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}

        {step === 4 && (
          <StepKYC
            onComplete={completeOnboarding}
            onSkip={completeOnboarding}
            onBack={() => setStep(3)}
            loading={loading}
          />
        )}

        {error && (
          <div className="mt-4 rounded-[10px] border border-[#B84545]/30 bg-[rgba(184,69,69,0.08)] px-4 py-3">
            <p className="text-sm text-[#B84545]">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---- Étape 1 : Identité ---- */
function StepIdentite({
  displayName,
  bio,
  city,
  onChange,
  onNext,
  loading,
}: {
  displayName: string
  bio: string
  city: string
  onChange: (d: Partial<{ displayName: string; bio: string; city: string }>) => void
  onNext: () => void
  loading: boolean
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
          Parlez-nous de vous
        </h2>
        <p className="text-sm text-[#6B6B6B] mt-1">Ces informations seront visibles sur votre profil public.</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Nom affiché publiquement"
          placeholder="Ange Kouamé"
          value={displayName}
          onChange={(e) => onChange({ displayName: e.target.value })}
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#F5F2EA]">Bio <span className="text-[#6B6B6B]">(200 caractères max)</span></label>
          <textarea
            className="flex min-h-[100px] w-full rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-sm text-[#F5F2EA] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30 resize-none transition-colors"
            placeholder="Créateur lifestyle basé à Abidjan. J'aide les marques à toucher une audience jeune et engagée."
            maxLength={200}
            value={bio}
            onChange={(e) => onChange({ bio: e.target.value })}
          />
          <p className="text-xs text-[#6B6B6B] text-right">{bio.length}/200</p>
        </div>
        <Input
          label="Ville"
          placeholder="Abidjan"
          value={city}
          onChange={(e) => onChange({ city: e.target.value })}
        />
      </div>

      <Button
        variant="primary-gold"
        size="lg"
        onClick={onNext}
        loading={loading}
        disabled={!displayName.trim()}
        className="w-full"
      >
        Continuer <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

/* ---- Étape 2 : Niches ---- */
function StepNiches({
  selectedNiches,
  onChange,
  onNext,
  onBack,
  loading,
}: {
  selectedNiches: string[]
  onChange: (niches: string[]) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
}) {
  const toggle = (value: string) => {
    if (selectedNiches.includes(value)) {
      onChange(selectedNiches.filter((n) => n !== value))
    } else {
      onChange([...selectedNiches, value])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
          Vos niches de contenu
        </h2>
        <p className="text-sm text-[#6B6B6B] mt-1">Sélectionnez au moins 1 niche. Cela aide les marques à vous trouver.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {NICHES.map((niche) => {
          const isSelected = selectedNiches.includes(niche.value)
          return (
            <button
              key={niche.value}
              onClick={() => toggle(niche.value)}
              className={cn(
                'rounded-[10px] px-4 py-2 text-sm font-medium border transition-all duration-150',
                isSelected
                  ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                  : 'border-[#2A2A2A] bg-[#2A2A2A] text-[#6B6B6B] hover:border-[#C9A84C]/40 hover:text-[#F5F2EA]',
              )}
            >
              {niche.label}
            </button>
          )
        })}
      </div>

      {selectedNiches.length > 0 && (
        <p className="text-xs text-[#6B6B6B]">
          {selectedNiches.length} niche{selectedNiches.length > 1 ? 's' : ''} sélectionnée{selectedNiches.length > 1 ? 's' : ''}
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" onClick={onBack} className="flex-1">
          <ChevronLeft className="size-4" /> Retour
        </Button>
        <Button
          variant="primary-gold"
          size="lg"
          onClick={onNext}
          loading={loading}
          disabled={selectedNiches.length === 0}
          className="flex-1"
        >
          Continuer <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

/* ---- Étape 3 : Réseaux sociaux ---- */
function StepReseaux({
  instagramHandle,
  tiktokHandle,
  youtubeHandle,
  onChange,
  onNext,
  onBack,
  loading,
}: {
  instagramHandle: string
  tiktokHandle: string
  youtubeHandle: string
  onChange: (d: Partial<{ instagramHandle: string; tiktokHandle: string; youtubeHandle: string }>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
}) {
  const hasAtLeastOne = instagramHandle.trim() || tiktokHandle.trim() || youtubeHandle.trim()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
          Vos réseaux sociaux
        </h2>
        <p className="text-sm text-[#6B6B6B] mt-1">Ajoutez au moins un réseau pour être visible sur la marketplace.</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Instagram"
          placeholder="votre_handle (sans @)"
          prefix={<Instagram className="size-4" />}
          value={instagramHandle}
          onChange={(e) => onChange({ instagramHandle: e.target.value.replace('@', '') })}
        />
        <Input
          label="TikTok"
          placeholder="votre_handle (sans @)"
          prefix={<span className="text-xs font-bold text-[#6B6B6B]">TT</span>}
          value={tiktokHandle}
          onChange={(e) => onChange({ tiktokHandle: e.target.value.replace('@', '') })}
        />
        <Input
          label="YouTube"
          placeholder="@votrechaine"
          prefix={<span className="text-xs font-bold text-[#6B6B6B]">YT</span>}
          value={youtubeHandle}
          onChange={(e) => onChange({ youtubeHandle: e.target.value })}
        />
      </div>

      <div className="rounded-[10px] border border-[#C9A84C]/20 bg-[rgba(201,168,76,0.04)] p-4">
        <p className="text-xs text-[#6B6B6B]">
          <span className="text-[#C9A84C] font-medium">Vérification :</span>{' '}
          Nos équipes valideront manuellement vos handles et vous obtiendrez le badge{' '}
          <span className="text-[#4A8B5C]">✓ Vérifié</span> sous 24–48h.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" onClick={onBack} className="flex-1">
          <ChevronLeft className="size-4" /> Retour
        </Button>
        <Button
          variant="primary-gold"
          size="lg"
          onClick={onNext}
          loading={loading}
          disabled={!hasAtLeastOne}
          className="flex-1"
        >
          Continuer <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

/* ---- Étape 4 : Tarifs ---- */
function StepTarifs({
  baseRatePost,
  baseRateStory,
  baseRateReel,
  baseRateVideo,
  onChange,
  onNext,
  onBack,
  loading,
}: {
  baseRatePost: string
  baseRateStory: string
  baseRateReel: string
  baseRateVideo: string
  onChange: (d: Partial<{ baseRatePost: string; baseRateStory: string; baseRateReel: string; baseRateVideo: string }>) => void
  onNext: () => void
  onBack: () => void
  loading: boolean
}) {
  const rates = [
    { key: 'baseRatePost' as const, label: 'Post statique', value: baseRatePost },
    { key: 'baseRateStory' as const, label: 'Story (x5)', value: baseRateStory },
    { key: 'baseRateReel' as const, label: 'Reel / Short', value: baseRateReel },
    { key: 'baseRateVideo' as const, label: 'Vidéo longue', value: baseRateVideo },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
          Vos tarifs de base
        </h2>
        <p className="text-sm text-[#6B6B6B] mt-1">En FCFA. Vous pourrez toujours négocier par la suite.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {rates.map((item) => (
          <Input
            key={item.key}
            type="number"
            label={item.label}
            placeholder="50 000"
            value={item.value}
            onChange={(e) => onChange({ [item.key]: e.target.value })}
            suffix={<span className="text-xs text-[#6B6B6B]">F</span>}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" onClick={onBack} className="flex-1">
          <ChevronLeft className="size-4" /> Retour
        </Button>
        <Button
          variant="primary-gold"
          size="lg"
          onClick={onNext}
          loading={loading}
          className="flex-1"
        >
          Continuer <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

/* ---- Étape 5 : KYC ---- */
function StepKYC({
  onComplete,
  onSkip,
  onBack,
  loading,
}: {
  onComplete: () => void
  onSkip: () => void
  onBack: () => void
  loading: boolean
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
          Vérification d&apos;identité (KYC)
        </h2>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Requis pour recevoir des paiements. Conformément à la réglementation BCEAO.
        </p>
      </div>

      <div className="space-y-3">
        {[
          { title: 'Pièce d\'identité', desc: 'CNI ou passeport (recto-verso)' },
          { title: 'Selfie liveness', desc: 'Photo avec la pièce d\'identité' },
          { title: 'RIB Wave / Orange Money', desc: 'Numéro de téléphone lié' },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 rounded-[12px] border border-dashed border-[#2A2A2A] bg-[#1A1A1A]/50 p-4 cursor-pointer hover:border-[#C9A84C]/30 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#2A2A2A] shrink-0">
              <Upload className="size-5 text-[#6B6B6B]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F5F2EA]">{item.title}</p>
              <p className="text-xs text-[#6B6B6B]">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A] p-4">
        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          Vos documents sont chiffrés et stockés en conformité avec la{' '}
          <span className="text-[#F5F2EA]">Loi n° 2013-450 (ARTCI)</span> et le{' '}
          <span className="text-[#F5F2EA]">RGPD</span>. Conservation limitée à 10 ans (obligation légale LBC-FT).
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" onClick={onBack} className="flex-none px-4">
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={onSkip}
          loading={loading}
          className="flex-1"
        >
          Plus tard
        </Button>
        <Button
          variant="primary-gold"
          size="lg"
          onClick={onComplete}
          loading={loading}
          className="flex-1"
        >
          Terminer
        </Button>
      </div>
    </div>
  )
}
