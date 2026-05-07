import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BrandRegisterForm } from './_components/brand-register-form'

export const metadata: Metadata = {
  title: 'Inscription marque',
}

export default function BrandRegisterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <Link
          href="/auth/register"
          className="flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#C9A84C] transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Retour
        </Link>
        <h1 className="text-2xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Créer mon compte marque
        </h1>
        <p className="text-sm text-[#6B6B6B]">Accès gratuit · Créateurs vérifiés · Facturation pro</p>
      </div>

      <BrandRegisterForm />

      <p className="text-center text-xs text-[#6B6B6B]">
        En vous inscrivant, vous acceptez nos{' '}
        <Link href="/legal/cgu" className="text-[#C9A84C] hover:underline">
          CGU
        </Link>{' '}
        et notre{' '}
        <Link href="/legal/privacy" className="text-[#C9A84C] hover:underline">
          Politique de confidentialité
        </Link>
        .
      </p>
    </div>
  )
}
