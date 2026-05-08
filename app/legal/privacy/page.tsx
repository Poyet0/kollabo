import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'Confidentialité — KOLLABO' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4">
          <Link href="/legal" className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#F5F2EA] transition-colors">
            <ArrowLeft className="size-4" /> Retour aux documents légaux
          </Link>
          <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
            Politique de confidentialité
          </h1>
          <p className="text-sm text-[#6B6B6B]">Dernière mise à jour : 1er janvier 2026 — Conforme RGPD et Loi n° 2013-450 ARTCI</p>
        </div>

        <div className="space-y-8 text-[#B0B0B0] text-sm leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">1. Responsable du traitement</h2>
            <p>KOLLABO SAS, dont le siège social est établi à Abidjan, Plateau, Côte d&apos;Ivoire (RCCM CI-ABJ-2025-B-XXXX), est responsable du traitement de vos données personnelles. Contact DPO : <a href="mailto:privacy@kollabo.ci" className="text-[#C9A84C] hover:underline">privacy@kollabo.ci</a></p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">2. Données collectées</h2>
            <p>Nous collectons les catégories de données suivantes :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-[#F5F2EA]">Données d&apos;identification :</strong> nom, prénom, email, numéro de téléphone, ville</li>
              <li><strong className="text-[#F5F2EA]">Documents KYC :</strong> CNI/passeport, selfie de vérification, RIB ou Mobile Money (pour les Créateurs)</li>
              <li><strong className="text-[#F5F2EA]">Données professionnelles :</strong> handles réseaux sociaux, statistiques d&apos;audience, niches, tarifs</li>
              <li><strong className="text-[#F5F2EA]">Données transactionnelles :</strong> contrats, montants, statuts de paiement, historique de retraits</li>
              <li><strong className="text-[#F5F2EA]">Données de navigation :</strong> adresse IP, type de navigateur, pages visitées (via cookies analytics)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">3. Finalités et bases légales</h2>
            <div className="rounded-[12px] border border-[#2A2A2A] overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#1A1A1A] border-b border-[#2A2A2A]">
                    <th className="text-left px-4 py-3 text-[#6B6B6B] font-medium">Finalité</th>
                    <th className="text-left px-4 py-3 text-[#6B6B6B] font-medium">Base légale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2A]">
                  {[
                    ['Création et gestion de votre compte', 'Exécution du contrat (CGU)'],
                    ['Vérification d\'identité (KYC/LBC-FT)', 'Obligation légale (Loi 2016-992)'],
                    ['Traitement des paiements et escrow', 'Exécution du contrat'],
                    ['Émission de factures et justificatifs RAS', 'Obligation légale (CGI ivoirien)'],
                    ['Analytics et amélioration du service', 'Intérêt légitime / consentement'],
                    ['Envoi de notifications et newsletters', 'Consentement'],
                  ].map(([finalite, base]) => (
                    <tr key={finalite} className="bg-[#121212]">
                      <td className="px-4 py-3 text-[#B0B0B0]">{finalite}</td>
                      <td className="px-4 py-3 text-[#B0B0B0]">{base}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">4. Conservation des données</h2>
            <p>Vos données sont conservées pendant la durée de votre relation contractuelle avec KOLLABO, puis :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Données de compte : 3 ans après la clôture du compte</li>
              <li>Contrats et factures : 10 ans (obligation légale comptable SYSCOHADA)</li>
              <li>Données KYC : 5 ans après la fin de la relation d&apos;affaires (LBC-FT)</li>
              <li>Données de navigation : 13 mois (CNIL/ARTCI)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">5. Transferts de données</h2>
            <p>Vos données sont hébergées par Supabase Inc. (serveurs dans l&apos;Union Européenne — Frankfurt, Allemagne), soumis au RGPD et bénéficiant de clauses contractuelles types de la Commission européenne.</p>
            <p>Nos sous-traitants principaux : Supabase (infrastructure), Resend (emails transactionnels), CinetPay (paiements), PostHog (analytics). Chacun est lié par un accord de traitement de données (DPA).</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">6. Vos droits</h2>
            <p>Conformément au RGPD et à la Loi n° 2013-450, vous disposez des droits suivants :</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-[#F5F2EA]">Accès :</strong> obtenir une copie de vos données (format JSON via Paramètres &gt; RGPD)</li>
              <li><strong className="text-[#F5F2EA]">Rectification :</strong> corriger vos données dans votre profil</li>
              <li><strong className="text-[#F5F2EA]">Suppression :</strong> demander la suppression de votre compte (sauf obligations légales)</li>
              <li><strong className="text-[#F5F2EA]">Portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong className="text-[#F5F2EA]">Opposition :</strong> vous opposer au traitement pour motif légitime</li>
            </ul>
            <p>Pour exercer vos droits : <a href="mailto:privacy@kollabo.ci" className="text-[#C9A84C] hover:underline">privacy@kollabo.ci</a> ou via Paramètres &gt; Mes données. Réponse sous 30 jours.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">7. Cookies</h2>
            <p>KOLLABO utilise des cookies strictement nécessaires (authentification, sécurité) et des cookies analytics (PostHog, avec votre consentement). Vous pouvez gérer vos préférences via la bannière de consentement ou les paramètres de votre navigateur.</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">8. Réclamation</h2>
            <p>En cas de litige non résolu, vous pouvez adresser une réclamation à l&apos;ARTCI (Autorité de Régulation des Télécommunications/TIC de Côte d&apos;Ivoire) ou à toute autorité de protection des données compétente.</p>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] pt-6 text-xs text-[#6B6B6B]">
          DPO KOLLABO : <a href="mailto:privacy@kollabo.ci" className="text-[#C9A84C] hover:underline">privacy@kollabo.ci</a>
        </div>
      </div>
    </div>
  )
}
