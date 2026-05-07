import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoneyDisplay } from '@/components/ui/money-display'
import { formatFollowers } from '@/lib/utils'
import { MapPin, Instagram, Star, CheckCircle, Briefcase } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('creator_profiles')
    .select('display_name, bio, profiles!inner(city)')
    .eq('instagram_handle', handle)
    .eq('is_active', true)
    .single()

  if (!data) return { title: 'Créateur introuvable' }

  return {
    title: `${data.display_name} — Créateur KOLLABO`,
    description: data.bio ?? `Profil créateur de ${data.display_name} sur KOLLABO`,
    openGraph: {
      title: `${data.display_name} sur KOLLABO`,
      description: data.bio ?? '',
    },
  }
}

const NICHE_LABELS: Record<string, string> = {
  mode: 'Mode', beaute: 'Beauté', lifestyle: 'Lifestyle', food: 'Food',
  tech: 'Tech', gaming: 'Gaming', sport: 'Sport', business: 'Business',
  parenting: 'Parentalité', voyage: 'Voyage', art: 'Art', musique: 'Musique',
  humour: 'Humour', education: 'Éducation',
}

export default async function CreatorPublicProfilePage({ params }: Props) {
  const { handle } = await params
  const supabase = await createClient()

  const { data: creator } = await supabase
    .from('creator_profiles')
    .select('*, profiles!inner(*)')
    .eq('instagram_handle', handle)
    .eq('is_active', true)
    .single()

  if (!creator) notFound()

  const profile = creator.profiles as Record<string, unknown>
  const niches = creator.niche ?? []
  const ratingAvg = Number(creator.rating_avg ?? 0)

  // Reviews publics
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, reviewer:reviewer_id(full_name, avatar_url)')
    .eq('reviewee_id', profile['id'])
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Vérifier si l'utilisateur connecté est une marque
  const { data: { user } } = await supabase.auth.getUser()
  const isBrand = user
    ? (await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single()
      ).data?.user_type === 'brand'
    : false

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation minimale */}
      <nav className="border-b border-[#1A1A1A] px-6 py-4">
        <Link
          href="/discover"
          className="text-sm text-[#6B6B6B] hover:text-[#C9A84C] transition-colors"
        >
          ← Retour aux créateurs
        </Link>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-10 space-y-10">
        {/* Hero */}
        <div className="relative">
          {/* Bannière */}
          <div className="h-48 rounded-[16px] bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C9A84C'%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '40px 40px',
            }} />
          </div>

          {/* Photo + infos */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mt-[-48px] px-2">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-[#0A0A0A] bg-[#2A2A2A] text-2xl font-bold text-[#C9A84C] font-[family-name:var(--font-display)] z-10">
              {String(creator.display_name).charAt(0)}
            </div>

            <div className="flex-1 min-w-0 pt-10 sm:pt-0 sm:mt-12 space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
                  {creator.display_name}
                </h1>
                {profile['kyc_status'] === 'verified' && (
                  <CheckCircle className="size-5 text-[#4A8B5C]" aria-label="KYC vérifié" />
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-[#6B6B6B] flex-wrap">
                {profile['city'] && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {String(profile['city'])}
                  </span>
                )}
                {creator.instagram_handle && (
                  <span className="flex items-center gap-1">
                    <Instagram className="size-3.5" />
                    @{creator.instagram_handle}
                    {creator.instagram_verified && (
                      <CheckCircle className="size-3 text-[#4A8B5C]" />
                    )}
                  </span>
                )}
                {ratingAvg > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="size-3.5 text-[#C9A84C] fill-[#C9A84C]" />
                    {ratingAvg.toFixed(1)} ({creator.rating_count} avis)
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {niches.map((niche: string) => (
                  <Badge key={niche} variant="gold">{NICHE_LABELS[niche] ?? niche}</Badge>
                ))}
              </div>
            </div>

            {/* CTA marque */}
            {isBrand && (
              <div className="shrink-0 mt-12 hidden sm:block">
                <Button variant="primary-gold" size="lg" asChild>
                  <Link href={`/campaigns/new?invite=${profile['id']}`}>
                    <Briefcase className="size-4" />
                    Inviter sur une campagne
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {creator.bio && (
          <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-6">
            <p className="text-sm text-[#6B6B6B] leading-relaxed">{creator.bio}</p>
          </div>
        )}

        {/* Stats plateformes */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {creator.instagram_followers && (
            <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 text-center space-y-1">
              <Instagram className="size-5 text-[#6B6B6B] mx-auto" />
              <p className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
                {formatFollowers(creator.instagram_followers)}
              </p>
              <p className="text-xs text-[#6B6B6B]">Instagram</p>
            </div>
          )}
          {creator.tiktok_followers && (
            <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 text-center space-y-1">
              <span className="text-lg">🎵</span>
              <p className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
                {formatFollowers(creator.tiktok_followers)}
              </p>
              <p className="text-xs text-[#6B6B6B]">TikTok</p>
            </div>
          )}
          {creator.youtube_subscribers && (
            <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 text-center space-y-1">
              <span className="text-lg">▶️</span>
              <p className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
                {formatFollowers(creator.youtube_subscribers)}
              </p>
              <p className="text-xs text-[#6B6B6B]">YouTube</p>
            </div>
          )}
        </div>

        {/* Tarifs */}
        {(creator.base_rate_post || creator.base_rate_story || creator.base_rate_reel || creator.base_rate_video) && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
              Tarifs par format
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Post', amount: creator.base_rate_post },
                { label: 'Story', amount: creator.base_rate_story },
                { label: 'Reel', amount: creator.base_rate_reel },
                { label: 'Vidéo longue', amount: creator.base_rate_video },
              ]
                .filter((item) => item.amount)
                .map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[12px] border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-center space-y-1"
                  >
                    <p className="text-xs text-[#6B6B6B]">{item.label}</p>
                    <MoneyDisplay amount={item.amount!} variant="gold" size="md" />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Avis */}
        {reviews && reviews.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
              Avis marques ({creator.rating_count})
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review) => {
                const reviewer = review.reviewer as Record<string, unknown>
                return (
                  <div
                    key={review.id}
                    className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 ${i < review.rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#2A2A2A]'}`}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">{review.comment}</p>
                    )}
                    <p className="text-xs text-[#6B6B6B]">
                      {reviewer ? String(reviewer['full_name']) : 'Marque anonyme'}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA mobile */}
        {isBrand && (
          <div className="sm:hidden sticky bottom-6">
            <Button variant="primary-gold" size="lg" className="w-full shadow-[0_8px_24px_rgba(201,168,76,0.3)]" asChild>
              <Link href={`/campaigns/new?invite=${profile['id']}`}>
                <Briefcase className="size-4" />
                Inviter sur une campagne
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
