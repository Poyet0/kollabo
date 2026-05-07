import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Inscription',
}

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Rejoindre KOLLABO
        </h1>
        <p className="text-sm text-[#6B6B6B]">
          Je suis un(e)…
        </p>
      </div>

      <div className="grid gap-4">
        {/* Créateur */}
        <Link
          href="/auth/register/creator"
          className="group flex items-start gap-4 rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 transition-all duration-200 hover:border-[#C9A84C]/50 hover:bg-[rgba(201,168,76,0.04)] hover:-translate-y-0.5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#2A2A2A] group-hover:bg-[rgba(201,168,76,0.12)] transition-colors">
            <Users className="size-6 text-[#6B6B6B] group-hover:text-[#C9A84C] transition-colors" />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
              Créateur de contenu
            </p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Trouvez des collaborations rémunérées, gérez vos contrats et recevez vos paiements en sécurité.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Paiement garanti', 'Contrats clairs', 'Wave · OM · MTN'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-[6px] border border-[#2A2A2A] bg-[#2A2A2A] px-2 py-0.5 text-[#6B6B6B]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>

        {/* Marque */}
        <Link
          href="/auth/register/brand"
          className="group flex items-start gap-4 rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 transition-all duration-200 hover:border-[#C9A84C]/50 hover:bg-[rgba(201,168,76,0.04)] hover:-translate-y-0.5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[#2A2A2A] group-hover:bg-[rgba(201,168,76,0.12)] transition-colors">
            <Briefcase className="size-6 text-[#6B6B6B] group-hover:text-[#C9A84C] transition-colors" />
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
              Marque / Annonceur
            </p>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Lancez des campagnes d&apos;influence avec des créateurs vérifiés. Traçabilité comptable et fiscale incluse.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Créateurs vérifiés', 'ROI mesurable', 'Factures TVA'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-[6px] border border-[#2A2A2A] bg-[#2A2A2A] px-2 py-0.5 text-[#6B6B6B]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </div>

      <p className="text-center text-sm text-[#6B6B6B]">
        Déjà un compte ?{' '}
        <Link
          href="/auth/login"
          className="text-[#C9A84C] hover:text-[#E8C977] font-medium transition-colors"
        >
          Se connecter
        </Link>
      </p>
    </div>
  )
}
