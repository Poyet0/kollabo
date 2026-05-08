'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Entreprise', 'Contact', 'Branding', 'Facturation']

const SECTORS = [
  'Cosmétique / Beauté',
  'Mode / Textile',
  'Alimentaire',
  'Tech / Telecom',
  'Finance / Fintech',
  'Automobile',
  'Immobilier',
  'Santé',
  'E-commerce',
  'Éducation',
  'Loisirs / Entertainment',
  'Autre',
]

interface Props {
  profile: Record<string, unknown>
  currentStep: number
}

export function OnboardingBrandFlow({ profile, currentStep }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(currentStep)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    companyName: '',
    legalForm: '',
    rccm: '',
    dfe: '',
    sector: '',
    website: '',
    contactRole: '',
    billingCity: '',
    billingAddress: '',
  })

  async function saveStep(nextStep: number, extraData?: Record<string, unknown>) {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      await supabase
        .from('profiles')
        .update({ onboarding_step: nextStep })
        .eq('id', profile['id'])

      if (extraData?.brandUpdate) {
        await supabase
          .from('brand_profiles')
          .update(extraData.brandUpdate)
          .eq('profile_id', profile['id'])
      }

      setStep(nextStep)
    } catch {
      setError('Erreur lors de la sauvegarde.')
    } finally {
      setLoading(false)
    }
  }

  async function completeOnboarding() {
    setLoading(true)
    const supabase = createClient()

    await supabase
      .from('profiles')
      .update({ onboarding_completed: true, onboarding_step: 4 })
      .eq('id', profile['id'])

    router.push('/dashboard')
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
            Configurer mon espace marque
          </h1>
          <span className="text-sm text-[#6B6B6B]">{step + 1} / {STEPS.length}</span>
        </div>

        <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C9A84C] rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  i < step ? 'bg-[#4A8B5C] text-white' : i === step ? 'bg-[#C9A84C] text-[#0A0A0A]' : 'bg-[#2A2A2A] text-[#6B6B6B]',
                )}
              >
                {i < step ? <Check className="size-3" /> : i + 1}
              </div>
              <span className={cn('text-xs hidden sm:block', i === step ? 'text-[#F5F2EA] font-medium' : 'text-[#6B6B6B]')}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-[#2A2A2A] mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[24px] border border-[#2A2A2A] bg-[#1A1A1A] p-8">
        {/* Étape 1 : Entreprise */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">Votre entreprise</h2>
              <p className="text-sm text-[#6B6B6B] mt-1">Informations légales de votre société.</p>
            </div>
            <div className="space-y-4">
              <Input
                label="Raison sociale"
                placeholder="Cosmetics CI SARL"
                value={formData.companyName}
                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Forme juridique"
                  placeholder="SARL, SA, GIE..."
                  value={formData.legalForm}
                  onChange={(e) => setFormData((p) => ({ ...p, legalForm: e.target.value }))}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#F5F2EA]">Secteur</label>
                  <select
                    className="flex h-10 w-full rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A] px-3 text-sm text-[#F5F2EA] focus:outline-none focus:border-[#C9A84C] transition-colors"
                    value={formData.sector}
                    onChange={(e) => setFormData((p) => ({ ...p, sector: e.target.value }))}
                  >
                    <option value="">Sélectionner...</option>
                    {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="RCCM"
                  placeholder="CI-ABJ-2024-B-XXXXX"
                  value={formData.rccm}
                  onChange={(e) => setFormData((p) => ({ ...p, rccm: e.target.value }))}
                />
                <Input
                  label="DFE / Numéro fiscal"
                  placeholder="XXXXXXXXXXXXXXX"
                  value={formData.dfe}
                  onChange={(e) => setFormData((p) => ({ ...p, dfe: e.target.value }))}
                />
              </div>
              <Input
                label="Site web"
                type="url"
                placeholder="https://www.cosmetics-ci.com"
                value={formData.website}
                onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
              />
            </div>
            <Button
              variant="primary-gold"
              size="lg"
              onClick={() => saveStep(1, {
                brandUpdate: {
                  company_name: formData.companyName,
                  legal_form: formData.legalForm || null,
                  rccm: formData.rccm || null,
                  dfe: formData.dfe || null,
                  sector: formData.sector || null,
                  website: formData.website || null,
                },
              })}
              loading={loading}
              disabled={!formData.companyName}
              className="w-full"
            >
              Continuer <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        {/* Étape 2 : Contact */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">Votre rôle</h2>
              <p className="text-sm text-[#6B6B6B] mt-1">Qui gère les campagnes d&apos;influence ?</p>
            </div>
            <Input
              label="Votre fonction"
              placeholder="Brand Manager, Directeur Marketing..."
              value={formData.contactRole}
              onChange={(e) => setFormData((p) => ({ ...p, contactRole: e.target.value }))}
            />
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={() => setStep(0)} className="flex-1">
                <ChevronLeft className="size-4" /> Retour
              </Button>
              <Button
                variant="primary-gold"
                size="lg"
                onClick={() => saveStep(2, { brandUpdate: { contact_role: formData.contactRole || null } })}
                loading={loading}
                className="flex-1"
              >
                Continuer <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 3 : Branding */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">Logo & Branding</h2>
              <p className="text-sm text-[#6B6B6B] mt-1">Pour personnaliser vos campagnes et contrats.</p>
            </div>
            <div className="flex items-center gap-4 rounded-[12px] border border-dashed border-[#2A2A2A] p-6 cursor-pointer hover:border-[#C9A84C]/30 transition-colors">
              <div className="flex h-16 w-16 items-center justify-center rounded-[12px] bg-[#2A2A2A]">
                <span className="text-2xl">🏢</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#F5F2EA]">Uploader votre logo</p>
                <p className="text-xs text-[#6B6B6B]">PNG, JPG, SVG · max 2 MB · 200×200px min</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={() => setStep(1)} className="flex-1">
                <ChevronLeft className="size-4" /> Retour
              </Button>
              <Button
                variant="primary-gold"
                size="lg"
                onClick={() => saveStep(3)}
                loading={loading}
                className="flex-1"
              >
                Continuer <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Étape 4 : Facturation */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">Adresse de facturation</h2>
              <p className="text-sm text-[#6B6B6B] mt-1">Pour vos factures KOLLABO (commission + TVA 18%).</p>
            </div>
            <div className="space-y-4">
              <Input
                label="Adresse"
                placeholder="Cocody, Boulevard de la Paix..."
                value={formData.billingAddress}
                onChange={(e) => setFormData((p) => ({ ...p, billingAddress: e.target.value }))}
              />
              <Input
                label="Ville"
                placeholder="Abidjan"
                value={formData.billingCity}
                onChange={(e) => setFormData((p) => ({ ...p, billingCity: e.target.value }))}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="lg" onClick={() => setStep(2)} className="flex-none px-4">
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="primary-gold"
                size="lg"
                onClick={completeOnboarding}
                loading={loading}
                className="flex-1"
              >
                Accéder à mon espace marque 🎉
              </Button>
            </div>
          </div>
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
