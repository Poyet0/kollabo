import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { LoginForm } from './_components/login-form'

export const metadata: Metadata = {
  title: 'Connexion',
}

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Bon retour 👋
        </h1>
        <p className="text-sm text-[#6B6B6B]">
          Connectez-vous à votre compte KOLLABO
        </p>
      </div>

      <Suspense fallback={<div className="h-12" />}>
        <LoginForm />
      </Suspense>

      <div className="text-center">
        <p className="text-sm text-[#6B6B6B]">
          Pas encore de compte ?{' '}
          <Link
            href="/auth/register"
            className="text-[#C9A84C] hover:text-[#E8C977] font-medium transition-colors"
          >
            S&apos;inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  )
}
