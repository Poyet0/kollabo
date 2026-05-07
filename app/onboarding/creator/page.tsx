import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { OnboardingCreatorFlow } from './_components/onboarding-flow'

export default async function OnboardingCreatorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, creator_profiles(*)')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')
  if (profile.onboarding_completed) redirect('/dashboard')
  if (profile.user_type !== 'creator') redirect('/onboarding/brand')

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header minimal */}
      <div className="border-b border-[#1A1A1A] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[8px]"
            style={{ background: 'linear-gradient(135deg, #8C7330, #C9A84C)' }}
          >
            <span className="text-sm font-bold text-[#0A0A0A] font-[family-name:var(--font-display)]">K</span>
          </div>
          <span className="text-base font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">KOLLABO</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <OnboardingCreatorFlow
            profile={profile}
            currentStep={profile.onboarding_step ?? 0}
          />
        </div>
      </div>
    </div>
  )
}
