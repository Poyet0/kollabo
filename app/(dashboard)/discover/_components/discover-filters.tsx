'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const NICHES = [
  { value: 'mode', label: 'Mode' },
  { value: 'beaute', label: 'Beauté' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'food', label: 'Food' },
  { value: 'tech', label: 'Tech' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'sport', label: 'Sport' },
  { value: 'business', label: 'Business' },
  { value: 'voyage', label: 'Voyage' },
  { value: 'musique', label: 'Musique' },
]

const SORT_OPTIONS = [
  { value: 'rating', label: 'Note' },
  { value: 'followers', label: 'Popularité' },
  { value: 'campaigns', label: 'Expérience' },
]

interface DiscoverFiltersProps {
  currentFilters: Record<string, string | undefined>
}

export function DiscoverFilters({ currentFilters }: DiscoverFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`/discover?${params.toString()}`)
    },
    [router, searchParams],
  )

  const clearAll = () => router.push('/discover')
  const hasFilters = Object.values(currentFilters).some(Boolean)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Filtres</CardTitle>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs h-6 px-2">
              Effacer
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Niche */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Niche</p>
          <div className="flex flex-wrap gap-1.5">
            {NICHES.map((niche) => {
              const isActive = currentFilters['niche'] === niche.value
              return (
                <button
                  key={niche.value}
                  onClick={() => updateFilter('niche', isActive ? null : niche.value)}
                  className={`text-xs rounded-[6px] px-2.5 py-1 border transition-colors ${
                    isActive
                      ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                      : 'border-[#2A2A2A] bg-[#2A2A2A] text-[#6B6B6B] hover:border-[#C9A84C]/30 hover:text-[#F5F2EA]'
                  }`}
                >
                  {niche.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Abonnés minimum */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">
            Abonnés minimum
          </p>
          <div className="flex flex-col gap-1.5">
            {[
              { value: '1000', label: '1 000+' },
              { value: '10000', label: '10 000+' },
              { value: '50000', label: '50 000+' },
              { value: '100000', label: '100 000+' },
            ].map((opt) => {
              const isActive = currentFilters['min_followers'] === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('min_followers', isActive ? null : opt.value)}
                  className={`text-xs text-left rounded-[6px] px-3 py-1.5 border transition-colors ${
                    isActive
                      ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                      : 'border-[#2A2A2A] bg-transparent text-[#6B6B6B] hover:border-[#C9A84C]/30 hover:text-[#F5F2EA]'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Trier par */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6B6B6B] uppercase tracking-wider">Trier par</p>
          <div className="flex flex-col gap-1.5">
            {SORT_OPTIONS.map((opt) => {
              const isActive = (currentFilters['sort'] ?? 'rating') === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => updateFilter('sort', opt.value)}
                  className={`text-xs text-left rounded-[6px] px-3 py-1.5 border transition-colors ${
                    isActive
                      ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                      : 'border-[#2A2A2A] bg-transparent text-[#6B6B6B] hover:border-[#C9A84C]/30 hover:text-[#F5F2EA]'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
