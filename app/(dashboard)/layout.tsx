import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from './_components/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  // Redirige vers onboarding si non complété
  if (!profile.onboarding_completed) {
    const onboardingPath = profile.user_type === 'creator'
      ? '/onboarding/creator'
      : '/onboarding/brand'
    redirect(onboardingPath)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar profile={profile} />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
