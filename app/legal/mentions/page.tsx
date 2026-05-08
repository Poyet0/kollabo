import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'Mentions légales — KOLLABO' }

export default function MentionsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4">
          <Link href="/legal" className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#F5F2EA] transition-colors">
            <ArrowLeft className="size-4" /> Retour aux documents légaux
          </Link>
          <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
            Mentions légales
          </h1>
          <p className="text-sm text-[#6B6B6B]">Conformément à la Loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel</p>
        </div>

        <div className="space-y-8 text-[#B0B0B0] text-sm leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">Éditeur de la plateforme</h2>
            <div className="rounded-[12px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 space-y-2">
              <p><span className="text-[#6B6B6B]">Dénomination sociale :</span> <span className="text-[#F5F2EA]">KOLLABO SAS</span></p>
              <p><span className="text-[#6B6B6B]">Forme juridique :</span> Société par Actions Simplifiée de droit ivoirien</p>
              <p><span className="text-[#6B6B6B]">Siège social :</span> Plateau, Abidjan, Côte d&apos;Ivoire</p>
              <p><span className="text-[#6B6B6B]">RCCM :</span> CI-ABJ-2025-B-XXXX</p>
              <p><span className="text-[#6B6B6B]">Numéro fiscal (DFE) :</span> XXXXXXXX</p>
              <p><span className="text-[#6B6B6B]">Numéro ARTCI :</span> ARTCI-2025-XXXX</p>
              <p><span className="text-[#6B6B6B]">Capital social :</span> 10 000 000 FCFA</p>
              <p><span className="text-[#6B6B6B]">Email :</span> <a href="mailto:contact@kollabo.ci" className="text-[#C9A84C] hover:underline">contact@kollabo.ci</a></p>
              <p><span className="text-[#6B6B6B]">Téléphone :</span> +225 07 00 00 00</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">Directeur de la publication</h2>
            <p>Le Directeur de la publication est le Directeur Général de KOLLABO SAS.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">Hébergement</h2>
            <div className="rounded-[12px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 space-y-2">
              <p><span className="text-[#6B6B6B]">Infrastructure :</span> <span className="text-[#F5F2EA]">Supabase Inc.</span></p>
              <p><span className="text-[#6B6B6B]">Adresse :</span> 970 Toa Payoh North, #07-04, Singapore 318992</p>
              <p><span className="text-[#6B6B6B]">Région des données :</span> Europe West 1 (Frankfurt, Allemagne)</p>
              <p><span className="text-[#6B6B6B]">Hébergement Web :</span> Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">Propriété intellectuelle</h2>
            <p>L&apos;ensemble des éléments constituant la plateforme KOLLABO (marque, logo, charte graphique, textes, code source) sont la propriété exclusive de KOLLABO SAS et sont protégés par les dispositions du Code de la propriété intellectuelle applicable en Côte d&apos;Ivoire.</p>
            <p>Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments de la plateforme, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite préalable de KOLLABO SAS.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">Cookies et traceurs</h2>
            <p>La plateforme KOLLABO utilise des cookies pour assurer son fonctionnement, améliorer l&apos;expérience utilisateur et réaliser des statistiques d&apos;audience. Conformément à la réglementation ARTCI et au RGPD, votre consentement est recueilli avant le dépôt de tout cookie non essentiel.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">Médiation et litiges</h2>
            <p>En cas de litige relatif à l&apos;utilisation de la plateforme, vous pouvez contacter notre service juridique à <a href="mailto:legal@kollabo.ci" className="text-[#C9A84C] hover:underline">legal@kollabo.ci</a>. En l&apos;absence de résolution amiable, les tribunaux compétents d&apos;Abidjan seront saisis.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">Textes législatifs de référence</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel (ARTCI)</li>
              <li>Loi n° 2013-546 du 30 juillet 2013 relative aux transactions électroniques</li>
              <li>Loi n° 2016-992 du 22 novembre 2016 relative à la lutte contre le blanchiment de capitaux (LBC-FT)</li>
              <li>Code Général des Impôts de Côte d&apos;Ivoire (Article 56 — Retenue à la Source)</li>
              <li>Règlement SYSCOHADA révisé du 26 janvier 2017</li>
              <li>Règlement RGPD (UE) 2016/679</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] pt-6 text-xs text-[#6B6B6B]">
          Mis à jour le 1er janvier 2026 — <a href="mailto:legal@kollabo.ci" className="text-[#C9A84C] hover:underline">legal@kollabo.ci</a>
        </div>
      </div>
    </div>
  )
}
