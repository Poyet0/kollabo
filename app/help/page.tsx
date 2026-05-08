import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronDown, Search, MessageCircle, Book, CreditCard, Shield, FileText, Users } from 'lucide-react'

export const metadata: Metadata = { title: 'Centre d\'aide — KOLLABO' }

const categories = [
  {
    icon: Users,
    title: 'Créateurs',
    color: '#C9A84C',
    faqs: [
      {
        q: 'Comment m\'inscrire comme créateur ?',
        a: 'Cliquez sur "Je suis créateur" lors de votre inscription. Vous serez guidé à travers un onboarding de 5 étapes : identité, niches, réseaux sociaux, tarifs, et vérification KYC. Votre profil sera visible sur la marketplace dès validation.',
      },
      {
        q: 'Quand suis-je payé après la soumission des livrables ?',
        a: 'La marque dispose de 7 jours pour valider vos livrables. Sans action de sa part, les fonds sont automatiquement libérés. En cas de validation, le paiement est immédiat. Le délai de réception dépend ensuite de votre opérateur (Wave : instantané, Orange Money : quelques minutes, virement bancaire : 1-3 jours ouvrables).',
      },
      {
        q: 'Qu\'est-ce que la Retenue à la Source (RAS) de 7,5% ?',
        a: 'Conformément à l\'Article 56 du Code Général des Impôts ivoirien, KOLLABO est tenu de prélever 7,5% de RAS sur vos revenus au titre des Bénéfices Non Commerciaux (BNC). Vous recevez un justificatif mensuel que vous pouvez déduire de votre déclaration fiscale annuelle.',
      },
      {
        q: 'Comment puis-je retirer mes fonds ?',
        a: 'Depuis votre portefeuille, cliquez sur "Retirer mes fonds". Vous pouvez choisir entre Wave CI, Orange Money, MTN Mobile Money ou un virement bancaire (RIB ivoirien). Le montant minimum de retrait est de 5 000 FCFA.',
      },
      {
        q: 'La vérification KYC est-elle obligatoire ?',
        a: 'La KYC est obligatoire pour retirer vos fonds, conformément à la réglementation LBC-FT. Vous pouvez candidater à des campagnes et recevoir des contrats sans KYC, mais vos fonds resteront bloqués jusqu\'à la validation de votre identité.',
      },
    ],
  },
  {
    icon: Book,
    title: 'Marques',
    color: '#4A8B5C',
    faqs: [
      {
        q: 'Comment créer ma première campagne ?',
        a: 'Depuis votre dashboard, cliquez sur "Créer une campagne". Le formulaire en 4 étapes vous guide : brief créatif (objectif, description détaillée en Markdown), livrables (type, plateforme, quantité), budget et ciblage (dates, abonnés minimum, niches), puis récapitulatif avant publication.',
      },
      {
        q: 'Comment fonctionne le système d\'escrow ?',
        a: 'Lors de la signature d\'un contrat, vous déposez l\'intégralité du montant sur le compte séquestre de KOLLABO. Ces fonds ne sont disponibles ni pour vous ni pour le créateur. Une fois les livrables validés, KOLLABO libère le paiement. Cela garantit la sécurité des deux parties.',
      },
      {
        q: 'Quelles sont les commissions KOLLABO ?',
        a: 'Les commissions sont progressives : 15% pour les contrats < 500 000 FCFA, 12% entre 500 000 et 2 000 000 FCFA, 8% au-delà. Ces commissions sont soumises à la TVA à 18%. Vous visualisez le coût total (budget + commission TTC) avant toute validation.',
      },
      {
        q: 'Puis-je modifier une campagne après publication ?',
        a: 'Vous pouvez modifier le brief et les livrables tant qu\'aucun contrat n\'a été signé. Une fois un contrat actif, seules des modifications mineures sont possibles avec l\'accord du créateur.',
      },
      {
        q: 'Comment télécharger mes factures pour la comptabilité ?',
        a: 'Depuis la section Facturation, vous pouvez télécharger chaque facture au format PDF. Un export CSV au format SYSCOHADA révisé est disponible pour votre comptable. Les justificatifs RAS sont également disponibles pour vos déclarations fiscales.',
      },
    ],
  },
  {
    icon: CreditCard,
    title: 'Paiements',
    color: '#5B8DEF',
    faqs: [
      {
        q: 'Quels moyens de paiement sont acceptés ?',
        a: 'KOLLABO accepte : Wave CI, Orange Money CI, MTN Mobile Money CI, et les virements bancaires (banques ivoiriennes et UEMOA). Les paiements par carte bancaire internationale seront disponibles prochainement.',
      },
      {
        q: 'Le paiement est-il sécurisé ?',
        a: 'Tous les paiements sont traités par CinetPay (agrément BCEAO). Les fonds sont séquestrés sur un compte dédié, séparé des fonds opérationnels de KOLLABO. En cas de faillite de KOLLABO, vos fonds séquestrés sont protégés.',
      },
      {
        q: 'Que se passe-t-il en cas de litige sur un paiement ?',
        a: 'Ouvrez un litige depuis la page du contrat concerné. L\'équipe KOLLABO arbitre dans les 48-72 heures ouvrables. Si la décision vous est favorable, les fonds sont libérés immédiatement. En cas de désaccord avec la décision, vous pouvez saisir les tribunaux compétents d\'Abidjan.',
      },
    ],
  },
  {
    icon: Shield,
    title: 'Sécurité & Compte',
    color: '#E85D4A',
    faqs: [
      {
        q: 'Comment sécuriser mon compte ?',
        a: 'Activez l\'authentification à 2 facteurs (2FA) dans Paramètres > Sécurité. Utilisez un mot de passe unique d\'au moins 12 caractères. Ne partagez jamais vos identifiants. KOLLABO ne vous demandera jamais votre mot de passe par email ou téléphone.',
      },
      {
        q: 'J\'ai oublié mon mot de passe, que faire ?',
        a: 'Cliquez sur "Mot de passe oublié" sur la page de connexion. Un lien de réinitialisation valable 1 heure vous sera envoyé par email. Si vous ne recevez pas l\'email, vérifiez vos spams ou contactez support@kollabo.ci.',
      },
      {
        q: 'Comment supprimer mon compte ?',
        a: 'Depuis Paramètres > Mes données (RGPD), cliquez sur "Demander la suppression de mon compte". La suppression est irréversible et prend effet sous 30 jours. Vos données comptables (contrats, factures) sont conservées 10 ans conformément à la loi ivoirienne.',
      },
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero */}
      <div className="border-b border-[#2A2A2A] bg-[#111111] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
            Comment pouvons-nous vous aider ?
          </h1>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#6B6B6B]" />
            <input
              type="search"
              placeholder="Rechercher une question..."
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-[12px] pl-11 pr-4 py-3 text-sm text-[#F5F2EA] placeholder:text-[#6B6B6B] focus:outline-none focus:border-[#C9A84C]/50"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['Paiements', 'KYC', 'Campagne', 'Facturation', 'Contrat'].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-[#6B6B6B] cursor-pointer hover:border-[#C9A84C]/40 hover:text-[#F5F2EA] transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-16 px-4 space-y-14">
        {categories.map((cat) => (
          <div key={cat.title} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-[8px] flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                <cat.icon className="size-4" style={{ color: cat.color }} />
              </div>
              <h2 className="text-xl font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
                {cat.title}
              </h2>
            </div>
            <div className="space-y-2">
              {cat.faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-[12px] border border-[#2A2A2A] bg-[#1A1A1A] overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none text-sm font-medium text-[#F5F2EA] hover:text-[#C9A84C] transition-colors">
                    {faq.q}
                    <ChevronDown className="size-4 text-[#6B6B6B] shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-[#B0B0B0] leading-relaxed border-t border-[#2A2A2A] pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Contact support */}
        <div className="rounded-[20px] border border-[#C9A84C]/20 bg-[rgba(201,168,76,0.04)] p-8 text-center space-y-4">
          <MessageCircle className="size-8 text-[#C9A84C] mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
              Vous n&apos;avez pas trouvé votre réponse ?
            </h3>
            <p className="text-sm text-[#6B6B6B] mt-1">Notre équipe support est disponible du lundi au vendredi, 8h–18h (GMT).</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="mailto:support@kollabo.ci"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#C9A84C] text-[#0A0A0A] text-sm font-semibold hover:bg-[#B8975E] transition-colors"
            >
              Écrire au support
            </a>
            <a
              href="https://wa.me/2250700000000"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] border border-[#2A2A2A] text-[#F5F2EA] text-sm font-semibold hover:border-[#C9A84C]/40 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-[#6B6B6B]">
          <Link href="/legal/cgu" className="hover:text-[#C9A84C] transition-colors">CGU</Link>
          <Link href="/legal/privacy" className="hover:text-[#C9A84C] transition-colors">Confidentialité</Link>
          <Link href="/legal/mentions" className="hover:text-[#C9A84C] transition-colors">Mentions légales</Link>
        </div>
      </div>
    </div>
  )
}
