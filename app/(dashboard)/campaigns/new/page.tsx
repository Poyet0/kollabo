import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewCampaignForm } from './_components/new-campaign-form'

export const metadata: Metadata = { title: 'Nouvelle campagne' }

export default async function NewCampaignPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single()

  if (profile?.user_type !== 'brand') redirect('/dashboard')

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Créer une campagne
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Définissez votre brief, vos livrables et votre budget.
        </p>
      </div>
      <NewCampaignForm brandId={user.id} />
    </div>
  )
}
