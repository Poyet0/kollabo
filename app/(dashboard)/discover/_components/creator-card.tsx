import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MoneyDisplay } from '@/components/ui/money-display'
import { formatFollowers, cn } from '@/lib/utils'

interface CreatorCardProps {
  creator: Record<string, unknown>
}

const NICHE_LABELS: Record<string, string> = {
  mode: 'Mode',
  beaute: 'Beauté',
  lifestyle: 'Lifestyle',
  food: 'Food',
  tech: 'Tech',
  gaming: 'Gaming',
  sport: 'Sport',
  business: 'Business',
  parenting: 'Parentalité',
  voyage: 'Voyage',
  art: 'Art',
  musique: 'Musique',
  humour: 'Humour',
  education: 'Éducation',
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const profile = creator['profiles'] as Record<string, unknown>
  const handle = String(creator['instagram_handle'] ?? profile['id'])
  const niches = (creator['niche'] as string[]) ?? []
  const followers = (creator['instagram_followers'] as number) ?? 0
  const ratingAvg = Number(creator['rating_avg'] ?? 0)
  const minRate = Math.min(
    ...[
      creator['base_rate_post'],
      creator['base_rate_story'],
      creator['base_rate_reel'],
    ]
      .filter(Boolean)
      .map(Number),
  )

  return (
    <Link
      href={`/c/${handle}`}
      className="group relative overflow-hidden rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] transition-all duration-200 hover:border-[#C9A84C]/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Photo / Avatar */}
      <div className="aspect-[4/5] bg-[#2A2A2A] relative overflow-hidden">
        {/* Placeholder — remplacer par vraie photo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A]" />
        {profile['avatar_url'] ? (
          <img
            src={profile['avatar_url'] as string}
            alt={profile['full_name'] as string}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}

        {/* Overlay bas */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent p-4">
          <p className="text-base font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] truncate">
            {String(creator['display_name'])}
          </p>
          {profile['city'] ? (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="size-3 text-[#6B6B6B]" />
              <p className="text-xs text-[#6B6B6B]">{profile['city'] as string}</p>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-1 mt-2">
            {niches.slice(0, 2).map((niche) => (
              <Badge key={niche} variant="smoke" className="text-[10px]">
                {NICHE_LABELS[niche] ?? niche}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
          {followers > 0 && (
            <span className="font-semibold text-[#F5F2EA]">{formatFollowers(followers)}</span>
          )}
          {ratingAvg > 0 && (
            <div className="flex items-center gap-1">
              <Star className="size-3 text-[#C9A84C] fill-[#C9A84C]" />
              <span className="font-semibold text-[#F5F2EA]">{ratingAvg.toFixed(1)}</span>
            </div>
          )}
          <span>{creator['completed_campaigns'] as number} collabs</span>
        </div>

        {/* Tarif minimum — visible au hover */}
        {minRate > 0 && (
          <div
            className={cn(
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            )}
          >
            <p className="text-xs text-[#6B6B6B]">à partir de</p>
            <MoneyDisplay amount={minRate} size="sm" variant="gold" />
          </div>
        )}
      </div>
    </Link>
  )
}
