import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { CreatorCard } from './_components/creator-card'
import { DiscoverFilters } from './_components/discover-filters'
import { EmptyState } from '@/components/ui/empty-state'
import { Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Découvrir les créateurs',
}

interface SearchParams {
  [key: string]: string | undefined
  niche?: string
  city?: string
  min_followers?: string
  max_followers?: string
  sort?: string
  page?: string
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase
    .from('creator_profiles')
    .select(`
      *,
      profiles!inner(id, full_name, city, avatar_url, kyc_status)
    `)
    .eq('is_active', true)
    .eq('profiles.kyc_status', 'verified')

  if (params.niche) {
    query = query.contains('niche', [params.niche])
  }

  if (params.min_followers) {
    query = query.gte('instagram_followers', parseInt(params.min_followers))
  }

  if (params.max_followers) {
    query = query.lte('instagram_followers', parseInt(params.max_followers))
  }

  const sortBy = params.sort ?? 'rating'
  if (sortBy === 'rating') query = query.order('rating_avg', { ascending: false })
  else if (sortBy === 'followers') query = query.order('instagram_followers', { ascending: false })
  else if (sortBy === 'campaigns') query = query.order('completed_campaigns', { ascending: false })

  const { data: creators, error } = await query.limit(24)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Découvrir les créateurs
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          {creators?.length ?? 0} créateurs vérifiés disponibles
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filtres sidebar */}
        <aside className="hidden lg:block w-60 shrink-0">
          <Suspense fallback={<div className="h-40" />}>
            <DiscoverFilters currentFilters={params} />
          </Suspense>
        </aside>

        {/* Grille créateurs */}
        <div className="flex-1 min-w-0">
          {!creators || creators.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Aucun créateur trouvé"
              description="Essayez d'élargir vos filtres de recherche."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {creators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
