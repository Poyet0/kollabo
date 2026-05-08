import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: "CGU — KOLLABO" }

export default function CguPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4">
          <Link href="/legal" className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#F5F2EA] transition-colors">
            <ArrowLeft className="size-4" /> Retour aux documents légaux
          </Link>
          <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-sm text-[#6B6B6B]">Version en vigueur au 1er janvier 2026 — KOLLABO SAS, Abidjan, Côte d&apos;Ivoire</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-[#B0B0B0]">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h2 className="text-lg font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
                {section.title}
              </h2>
              <div className="space-y-2 leading-relaxed">
                {section.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#2A2A2A] pt-6 text-xs text-[#6B6B6B]">
          Pour toute question : <a href="mailto:legal@kollabo.ci" className="text-[#C9A84C] hover:underline">legal@kollabo.ci</a>
        </div>
      </div>
    </div>
  )
}

const sections = [
  {
    title: 'Article 1 — Objet et champ d\'application',
    content: [
      'Les présentes Conditions Générales d\'Utilisation (CGU) régissent l\'accès et l\'utilisation de la plateforme KOLLABO, marketplace B2B2C mettant en relation des créateurs de contenu numérique et des marques ou annonceurs, exploitée par la société KOLLABO SAS, inscrite au RCCM d\'Abidjan sous le numéro CI-ABJ-2025-B-XXXX.',
      'En s\'inscrivant sur KOLLABO, l\'Utilisateur accepte sans réserve les présentes CGU ainsi que la Politique de confidentialité. Ces documents constituent un contrat électronique au sens de la Loi n° 2013-546 du 30 juillet 2013 relative aux transactions électroniques en Côte d\'Ivoire.',
    ],
  },
  {
    title: 'Article 2 — Définitions',
    content: [
      '« Créateur » : toute personne physique ou morale inscrite sur KOLLABO en qualité de producteur de contenus numériques (photos, vidéos, articles, podcasts…).',
      '« Marque » : toute entreprise ou organisation inscrite sur KOLLABO en qualité d\'annonceur souhaitant collaborer avec des Créateurs.',
      '« Campagne » : brief publié par une Marque décrivant les livrables attendus et le budget alloué.',
      '« Contrat » : accord électronique signé entre une Marque et un Créateur via KOLLABO, constitutif d\'obligations légales.',
      '« Escrow » : mécanisme de séquestre des fonds géré par KOLLABO, garantissant le paiement du Créateur après validation des livrables.',
      '« Commission » : rémunération de KOLLABO prélevée sur chaque transaction, conformément à la grille tarifaire progressive.',
    ],
  },
  {
    title: 'Article 3 — Inscription et compte utilisateur',
    content: [
      'L\'inscription sur KOLLABO est réservée aux personnes majeures (18 ans révolus) et aux entités légalement constituées. Toute fausse déclaration entraîne la résiliation immédiate du compte.',
      'L\'Utilisateur s\'engage à fournir des informations exactes, à maintenir la confidentialité de ses identifiants, et à notifier immédiatement KOLLABO de tout accès non autorisé.',
      'KOLLABO se réserve le droit de suspendre ou supprimer tout compte sans préavis en cas de violation des présentes CGU, de comportement frauduleux ou de mise en danger de la plateforme.',
    ],
  },
  {
    title: 'Article 4 — Vérification d\'identité (KYC)',
    content: [
      'Conformément à la Loi n° 2016-992 du 22 novembre 2016 relative à la lutte contre le blanchiment de capitaux et le financement du terrorisme (LBC-FT) et aux instructions de la BCEAO, KOLLABO est tenu de vérifier l\'identité de ses utilisateurs avant tout retrait de fonds.',
      'Le Créateur doit fournir : une pièce d\'identité nationale valide (CNI, passeport), un justificatif de domicile de moins de 3 mois, et un RIB ou numéro de Mobile Money au nom du titulaire.',
      'KOLLABO s\'engage à traiter ces documents avec la plus stricte confidentialité, conformément à sa Politique de confidentialité.',
    ],
  },
  {
    title: 'Article 5 — Commissions et facturation',
    content: [
      'KOLLABO perçoit une commission sur chaque transaction réalisée via la plateforme, selon la grille progressive suivante : 15% pour les contrats inférieurs à 500 000 FCFA, 12% pour les contrats entre 500 000 et 2 000 000 FCFA, 8% pour les contrats supérieurs à 2 000 000 FCFA.',
      'Ces commissions sont soumises à la Taxe sur la Valeur Ajoutée (TVA) au taux de 18% applicable en Côte d\'Ivoire.',
      'Une Retenue à la Source (RAS) de 7,5% est appliquée sur les revenus des Créateurs conformément à l\'Article 56 du Code Général des Impôts ivoirien. KOLLABO remet un justificatif fiscal mensuel permettant au Créateur de déduire cette retenue de sa déclaration BNC.',
      'Les factures sont émises en Francs CFA (XOF) et conformes aux exigences du système comptable SYSCOHADA révisé.',
    ],
  },
  {
    title: 'Article 6 — Mécanisme d\'escrow',
    content: [
      'Lors de la signature d\'un Contrat, la Marque verse l\'intégralité du montant contractuel sur le compte séquestre de KOLLABO. Ces fonds sont bloqués jusqu\'à validation des livrables.',
      'La Marque dispose de 7 jours calendaires après soumission des livrables pour valider ou demander des corrections. Passé ce délai sans action, les fonds sont automatiquement libérés au Créateur.',
      'En cas de litige, KOLLABO dispose d\'un pouvoir d\'arbitrage. La décision de KOLLABO est définitive et exécutoire dans les limites prévues par la législation ivoirienne.',
    ],
  },
  {
    title: 'Article 7 — Propriété intellectuelle',
    content: [
      'Les contenus produits dans le cadre d\'une Campagne font l\'objet d\'une licence d\'utilisation dont les modalités sont définies dans le Contrat. En l\'absence de stipulation contraire, le Créateur conserve ses droits moraux sur l\'œuvre.',
      'La Marque obtient une licence d\'exploitation non exclusive, limitée géographiquement à la Côte d\'Ivoire et aux pays expressément mentionnés dans le Contrat, pour la durée prévue.',
      'KOLLABO ne revendique aucun droit de propriété sur les contenus créés par les Utilisateurs.',
    ],
  },
  {
    title: 'Article 8 — Responsabilité',
    content: [
      'KOLLABO est une plateforme d\'intermédiation. Sa responsabilité est limitée au bon fonctionnement des services techniques. KOLLABO ne saurait être tenu responsable des contenus publiés par les Utilisateurs, des retards dans l\'exécution des Contrats, ou de tout préjudice indirect.',
      'KOLLABO garantit la disponibilité de la plateforme à hauteur de 99,5% (hors maintenance programmée) et la sécurité des fonds séquestrés.',
    ],
  },
  {
    title: 'Article 9 — Droit applicable et juridiction',
    content: [
      'Les présentes CGU sont régies par le droit ivoirien. En cas de litige, les parties s\'efforceront de trouver une solution amiable dans un délai de 30 jours. À défaut, le litige sera soumis à la compétence exclusive des tribunaux d\'Abidjan, Côte d\'Ivoire.',
      'KOLLABO est enregistrée auprès de l\'ARTCI (Autorité de Régulation des Télécommunications/TIC de Côte d\'Ivoire) conformément à la Loi n° 2013-450 du 19 juin 2013.',
    ],
  },
]
