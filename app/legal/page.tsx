import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Shield, Info } from 'lucide-react'

export const metadata: Metadata = { title: 'Documents légaux — KOLLABO' }

const docs = [
  {
    icon: FileText,
    title: "Conditions Générales d'Utilisation",
    description: 'Règles d\'utilisation de la plateforme KOLLABO pour créateurs et marques.',
    href: '/legal/cgu',
    date: 'Mis à jour le 1er janvier 2026',
  },
  {
    icon: Shield,
    title: 'Politique de confidentialité',
    description: 'Comment KOLLABO collecte, traite et protège vos données personnelles (RGPD / ARTCI).',
    href: '/legal/privacy',
    date: 'Mis à jour le 1er janvier 2026',
  },
  {
    icon: Info,
    title: 'Mentions légales',
    description: 'Informations légales sur la société KOLLABO SAS et l\'hébergement.',
    href: '/legal/mentions',
    date: 'Mis à jour le 1er janvier 2026',
  },
]

export default function LegalIndexPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-4">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
            Documents légaux
          </h1>
          <p className="text-[#6B6B6B]">
            Conformément à la législation ivoirienne (Loi n° 2013-450 ARTCI, Loi n° 2013-546) et au RGPD.
          </p>
        </div>

        <div className="space-y-4">
          {docs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="flex items-start gap-4 rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-6 hover:border-[#C9A84C]/40 transition-colors group"
            >
              <div className="size-10 rounded-[10px] bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                <doc.icon className="size-5 text-[#C9A84C]" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-[#F5F2EA] group-hover:text-[#C9A84C] transition-colors">
                  {doc.title}
                </h2>
                <p className="text-sm text-[#6B6B6B] mt-1">{doc.description}</p>
                <p className="text-xs text-[#3A3A3A] mt-2">{doc.date}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-[#6B6B6B] text-center">
          Pour toute question légale :{' '}
          <a href="mailto:legal@kollabo.ci" className="text-[#C9A84C] hover:underline">
            legal@kollabo.ci
          </a>
        </p>
      </div>
    </div>
  )
}
