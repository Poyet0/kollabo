import type { Metadata } from 'next'
import { Suspense } from 'react'
import { OtpVerifyForm } from './_components/otp-verify-form'

export const metadata: Metadata = {
  title: 'Vérification',
}

export default function VerifyOtpPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1.5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(201,168,76,0.12)] mb-4">
          <svg className="size-7 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Vérifiez votre email
        </h1>
        <p className="text-sm text-[#6B6B6B]">
          Un lien de confirmation a été envoyé à votre adresse email. Cliquez dessus pour activer votre compte.
        </p>
      </div>

      <Suspense fallback={<div className="h-12" />}>
        <OtpVerifyForm />
      </Suspense>
    </div>
  )
}
