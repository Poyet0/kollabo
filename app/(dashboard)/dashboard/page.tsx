import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreatorDashboard } from './_components/creator-dashboard'
import { BrandDashboard } from './_components/brand-dashboard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, creator_profiles(*), brand_profiles(*)')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  return profile.user_type === 'creator'
    ? <CreatorDashboard profile={profile} />
    : <BrandDashboard profile={profile} />
}
