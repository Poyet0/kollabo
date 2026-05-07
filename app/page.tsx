import Link from 'next/link'
import { Shield, Zap, FileText, Star, ChevronRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F2EA]">
      {/* ---- NAVBAR ---- */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[#1A1A1A] bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[10px]"
              style={{ background: 'linear-gradient(135deg, #8C7330, #C9A84C, #E8C977)' }}
            >
              <span className="text-base font-bold text-[#0A0A0A] font-[family-name:var(--font-display)]">K</span>
            </div>
            <span className="text-lg font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
              KOLLABO
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-[#6B6B6B]">
            <Link href="#how" className="hover:text-[#F5F2EA] transition-colors">Comment ça marche</Link>
            <Link href="#pricing" className="hover:text-[#F5F2EA] transition-colors">Tarifs</Link>
            <Link href="/help" className="hover:text-[#F5F2EA] transition-colors">Aide</Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="md" asChild>
              <Link href="/auth/login">Se connecter</Link>
            </Button>
            <Button variant="primary-gold" size="md" asChild>
              <Link href="/auth/register">Commencer gratuitement</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ---- HERO ---- */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
        {/* Halo doré bas-droite */}
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.12] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #C9A84C, transparent 70%)' }}
        />
        {/* Halo subtil gauche */}
        <div
          className="absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E8C977, transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte — asymétrie volontaire */}
            <div className="space-y-8 lg:pr-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[rgba(201,168,76,0.06)] px-4 py-1.5">
                <span className="size-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
                <span className="text-xs font-medium text-[#C9A84C]">
                  Ouvert en Côte d&apos;Ivoire · UEMOA bientôt
                </span>
              </div>

              <h1
                className="text-5xl lg:text-7xl font-bold text-[#F5F2EA] leading-[0.95] tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Des collaborations
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #8C7330 0%, #C9A84C 50%, #E8C977 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  qui tiennent
                </span>
                <br />
                leurs promesses.
              </h1>

              <p className="text-lg text-[#6B6B6B] leading-relaxed max-w-lg">
                KOLLABO connecte les créateurs de contenu africains aux marques. Paiements sous séquestre,
                contrats certifiés, revenus garantis.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button variant="primary-gold" size="xl" asChild className="shadow-[0_8px_32px_rgba(201,168,76,0.3)]">
                  <Link href="/auth/register/creator">
                    Je suis créateur
                    <ChevronRight className="size-5" />
                  </Link>
                </Button>
                <Button variant="secondary-outline" size="xl" asChild>
                  <Link href="/auth/register/brand">Je suis une marque</Link>
                </Button>
              </div>

              {/* Micro-preuves */}
              <div className="flex flex-wrap items-center gap-5 pt-2">
                {[
                  { label: 'Commission 0 F à l\'inscription' },
                  { label: 'Paiements Wave & Orange Money' },
                  { label: 'Contrats conformes droit ivoirien' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
                    <CheckCircle className="size-3.5 text-[#4A8B5C] shrink-0" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Visuel — stack cartes 3D */}
            <div className="relative hidden lg:flex items-center justify-center h-[520px]">
              {/* Carte profil créateur — derrière */}
              <div
                className="absolute top-8 left-0 w-72 rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
                style={{ transform: 'rotate(-6deg) translateY(20px)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border border-[#C9A84C]/30" />
                  <div>
                    <p className="text-sm font-semibold text-[#F5F2EA]">Ange Kouamé</p>
                    <p className="text-xs text-[#6B6B6B]">Lifestyle · Abidjan</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[['35K', 'Abonnés'], ['4.9', 'Note'], ['12', 'Collabs']].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <p className="text-base font-bold text-[#C9A84C] font-[family-name:var(--font-display)]">{v}</p>
                      <p className="text-xs text-[#6B6B6B]">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carte campagne — au centre */}
              <div
                className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/3 w-80 rounded-[16px] border border-[#C9A84C]/30 bg-[#1A1A1A] p-5 shadow-[0_32px_80px_rgba(0,0,0,0.5),0_8px_24px_rgba(201,168,76,0.15)] z-10"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-[#C9A84C] bg-[rgba(201,168,76,0.1)] px-2.5 py-1 rounded-full">
                    Campagne active
                  </span>
                  <span className="text-xs text-[#6B6B6B]">J-5</span>
                </div>
                <p className="text-sm font-semibold text-[#F5F2EA] mb-1">Lancement Crème Eclat Premium</p>
                <p className="text-xs text-[#6B6B6B] mb-4">2 Reels Instagram · 1 Story</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#6B6B6B]">Budget total</p>
                    <p className="text-lg font-bold text-[#C9A84C] font-mono">250 000 F</p>
                  </div>
                  <div className="h-8 w-px bg-[#2A2A2A]" />
                  <div>
                    <p className="text-xs text-[#6B6B6B]">Créateur net</p>
                    <p className="text-lg font-bold text-[#F5F2EA] font-mono">212 500 F</p>
                  </div>
                </div>
              </div>

              {/* Carte paiement libéré — devant */}
              <div
                className="absolute bottom-8 right-0 w-64 rounded-[16px] border border-[#4A8B5C]/30 bg-[#1A1A1A] p-4 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
                style={{ transform: 'rotate(4deg)' }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(74,139,92,0.15)]">
                    <CheckCircle className="size-4 text-[#4A8B5C]" />
                  </div>
                  <p className="text-sm font-semibold text-[#4A8B5C]">Fonds libérés !</p>
                </div>
                <p className="text-2xl font-bold text-[#F5F2EA] font-mono">212 500 F</p>
                <p className="text-xs text-[#6B6B6B] mt-1">Wave · il y a 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- BANDEAU PARTENAIRES ---- */}
      <section className="border-y border-[#1A1A1A] py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            <p className="text-xs text-[#6B6B6B] font-medium uppercase tracking-widest">Paiements via</p>
            {['Wave', 'Orange Money', 'MTN MoMo', 'CinetPay'].map((partner) => (
              <span key={partner} className="text-sm font-semibold text-[#2A2A2A] grayscale hover:text-[#6B6B6B] transition-colors">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- COMMENT ÇA MARCHE ---- */}
      <section id="how" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-4 mb-16">
            <p className="text-xs font-medium text-[#C9A84C] uppercase tracking-widest">Simple. Sécurisé. Rapide.</p>
            <h2
              className="text-4xl lg:text-5xl font-bold text-[#F5F2EA] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Comment ça marche
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                icon: Star,
                title: 'Trouver',
                desc: 'Les marques publient leurs campagnes. Les créateurs trouvent celles qui correspondent à leur audience.',
              },
              {
                step: '02',
                icon: FileText,
                title: 'Négocier',
                desc: 'Soumettez un pitch, discutez du brief, ajustez les livrables. Tout dans une messagerie sécurisée.',
              },
              {
                step: '03',
                icon: Shield,
                title: 'Signer',
                desc: 'Un contrat certifié conforme au droit ivoirien. Signature électronique légale eIDAS.',
              },
              {
                step: '04',
                icon: Zap,
                title: 'Être payé',
                desc: 'Les fonds sont sécurisés en escrow. Libération automatique après validation des livrables.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-6 hover:border-[#C9A84C]/30 transition-colors group"
              >
                <span className="text-5xl font-bold text-[#1A1A1A] group-hover:text-[#C9A84C]/10 absolute top-4 right-5 font-[family-name:var(--font-display)] transition-colors select-none">
                  {item.step}
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[rgba(201,168,76,0.1)] mb-4">
                  <item.icon className="size-5 text-[#C9A84C]" />
                </div>
                <h3 className="text-lg font-semibold text-[#F5F2EA] mb-2 font-[family-name:var(--font-display)]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- STATS ---- */}
      <section className="py-16 border-y border-[#1A1A1A] bg-[#0D0D0D]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '1 247', label: 'Créateurs vérifiés' },
              { value: '89', label: 'Marques partenaires' },
              { value: '142 M F', label: 'Reversés aux créateurs' },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-3xl lg:text-5xl font-bold text-[#C9A84C] font-[family-name:var(--font-display)]"
                >
                  {stat.value}
                </p>
                <p className="text-sm text-[#6B6B6B] mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- TARIFS ---- */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center space-y-4 mb-16">
            <p className="text-xs font-medium text-[#C9A84C] uppercase tracking-widest">Transparent. Progressif.</p>
            <h2
              className="text-4xl lg:text-5xl font-bold text-[#F5F2EA] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Tarification simple
            </h2>
            <p className="text-[#6B6B6B]">
              Aucun abonnement. Vous ne payez qu&apos;en cas de collaboration réussie.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                type: 'Créateur',
                price: 'Gratuit',
                desc: 'Inscription et profil 100% gratuits',
                features: [
                  'Profil vérifié avec badge',
                  'Candidatures illimitées',
                  'Paiements Wave / Orange Money / MTN',
                  'Contrats légaux automatiques',
                  'Récap fiscal annuel (BNC)',
                  'Commission 8–15% seulement si collaboration',
                ],
              },
              {
                type: 'Marque',
                price: 'Gratuit',
                desc: 'Commission incluse dans le budget campagne',
                features: [
                  'Accès à tous les créateurs vérifiés',
                  'Campagnes illimitées',
                  'Paiement escrow sécurisé',
                  'Factures TVA 18% automatiques',
                  'Retenue à la source 7,5% (si applicable)',
                  'Export comptable SYSCOHADA',
                ],
              },
            ].map((plan) => (
              <div
                key={plan.type}
                className="rounded-[24px] border border-[#2A2A2A] bg-[#1A1A1A] p-8 space-y-6"
              >
                <div>
                  <p className="text-xs font-medium text-[#C9A84C] uppercase tracking-widest mb-2">{plan.type}</p>
                  <p className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
                    {plan.price}
                  </p>
                  <p className="text-sm text-[#6B6B6B] mt-1">{plan.desc}</p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[#6B6B6B]">
                      <CheckCircle className="size-4 text-[#4A8B5C] shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[16px] border border-[#C9A84C]/20 bg-[rgba(201,168,76,0.04)] p-6 text-center">
            <p className="text-sm text-[#6B6B6B]">
              <span className="text-[#C9A84C] font-semibold">Commission progressive :</span>{' '}
              15% en dessous de 500 000 F · 12% entre 500K et 2M F · 8% au-delà de 2M F (HT + TVA 18%)
            </p>
          </div>
        </div>
      </section>

      {/* ---- CTA FINAL ---- */}
      <section className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, #C9A84C, transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center space-y-8">
          <h2
            className="text-4xl lg:text-6xl font-bold text-[#F5F2EA] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Prêt à passer aux choses sérieuses ?
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-xl mx-auto">
            Rejoignez les créateurs et marques qui font de l&apos;influence autrement — avec du sérieux et de la transparence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary-gold" size="xl" asChild className="shadow-[0_8px_32px_rgba(201,168,76,0.3)]">
              <Link href="/auth/register/creator">Je suis créateur <ChevronRight className="size-5" /></Link>
            </Button>
            <Button variant="secondary-outline" size="xl" asChild>
              <Link href="/auth/register/brand">Je suis une marque</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="border-t border-[#1A1A1A] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-[8px]"
                  style={{ background: 'linear-gradient(135deg, #8C7330, #C9A84C)' }}
                >
                  <span className="text-sm font-bold text-[#0A0A0A] font-[family-name:var(--font-display)]">K</span>
                </div>
                <span className="text-base font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">KOLLABO</span>
              </Link>
              <p className="text-xs text-[#6B6B6B] leading-relaxed max-w-[200px]">
                La marketplace de l&apos;influence africaine. Abidjan, Côte d&apos;Ivoire.
              </p>
            </div>

            {[
              {
                title: 'Produit',
                links: [
                  { label: 'Créateurs', href: '/auth/register/creator' },
                  { label: 'Marques', href: '/auth/register/brand' },
                  { label: 'Tarifs', href: '#pricing' },
                  { label: 'Centre d\'aide', href: '/help' },
                ],
              },
              {
                title: 'Entreprise',
                links: [
                  { label: 'À propos', href: '/about' },
                  { label: 'Blog', href: '/blog' },
                  { label: 'Contact', href: '/contact' },
                ],
              },
              {
                title: 'Légal',
                links: [
                  { label: 'CGU', href: '/legal/cgu' },
                  { label: 'Confidentialité', href: '/legal/privacy' },
                  { label: 'Mentions légales', href: '/legal/mentions' },
                ],
              },
            ].map((col) => (
              <div key={col.title} className="space-y-3">
                <p className="text-xs font-semibold text-[#F5F2EA] uppercase tracking-wider">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#6B6B6B] hover:text-[#C9A84C] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#1A1A1A] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6B6B6B]">
              © 2026 KOLLABO SAS · RCCM CI-ABJ-2026-A-XXXXX · DFE XXXXXXXX · Capital : 1 000 000 F CFA
            </p>
            <p className="text-xs text-[#6B6B6B]">
              Hébergé par Vercel Inc. & Supabase Inc. · DPO : dpo@kollabo.app · Déclaration ARTCI n° XXXX
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
