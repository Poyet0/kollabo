import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connexion | KOLLABO',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[40%_60%]">
      {/* ---- Panneau gauche branding ---- */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#0A0A0A]">
        {/* Photo créateur en noir & blanc avec teinte or */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0.95) 100%)',
            }}
          />
          {/* Placeholder : remplacer par une vraie photo de créateur en production */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]" />
          {/* Motif adinkra watermark */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A84C' fill-opacity='1'%3E%3Cpath d='M30 0C13.431 0 0 13.431 0 30c0 16.569 13.431 30 30 30 16.569 0 30-13.431 30-30C60 13.431 46.569 0 30 0zm0 54C16.745 54 6 43.255 6 30 6 16.745 16.745 6 30 6c13.255 0 24 10.745 24 24 0 13.255-10.745 24-24 24z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Contenu */}
        <div className="relative z-20 flex flex-col justify-between h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-[10px]"
              style={{ background: 'linear-gradient(135deg, #8C7330, #C9A84C, #E8C977)' }}
            >
              <span className="text-lg font-bold text-[#0A0A0A] font-[family-name:var(--font-display)]">K</span>
            </div>
            <span className="text-xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
              KOLLABO
            </span>
          </div>

          {/* Citation */}
          <div className="space-y-6">
            {/* Halo doré décoratif */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] opacity-15"
              style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }}
            />

            <blockquote className="relative">
              <p className="text-2xl font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)] leading-snug">
                «&nbsp;Des collaborations qui tiennent leurs promesses.&nbsp;»
              </p>
              <footer className="mt-4">
                <p className="text-sm text-[#C9A84C] font-medium">Ange Kouamé</p>
                <p className="text-xs text-[#6B6B6B]">Créateur lifestyle · 35K abonnés · Abidjan</p>
              </footer>
            </blockquote>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#2A2A2A]">
              {[
                { value: '1 247', label: 'Créateurs' },
                { value: '89', label: 'Marques' },
                { value: '142 M F', label: 'Reversés' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-lg font-bold text-[#C9A84C] font-[family-name:var(--font-display)]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#6B6B6B]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Panneau droit — formulaire ---- */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-[#0A0A0A]">
        <div className="w-full max-w-[420px]">
          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[10px]"
              style={{ background: 'linear-gradient(135deg, #8C7330, #C9A84C, #E8C977)' }}
            >
              <span className="text-base font-bold text-[#0A0A0A] font-[family-name:var(--font-display)]">K</span>
            </div>
            <span className="text-lg font-bold text-[#F5F2EA] font-[family-name:var(--font-display)]">
              KOLLABO
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
