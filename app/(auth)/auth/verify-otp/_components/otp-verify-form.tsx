'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function OtpVerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'
  const [resent, setResent] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          router.push(next)
          router.refresh()
        }
      },
    )
    return () => subscription.unsubscribe()
  }, [next, router])

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  async function handleResend() {
    setResent(true)
    setCountdown(60)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[16px] border border-[#2A2A2A] bg-[#1A1A1A] p-5">
        <p className="text-sm text-[#6B6B6B] leading-relaxed">
          Vérifiez votre boîte mail, y compris les spams. Le lien expire dans{' '}
          <span className="text-[#F5F2EA] font-medium">24 heures</span>.
        </p>
      </div>

      {resent && (
        <div className="rounded-[10px] border border-[#4A8B5C]/30 bg-[rgba(74,139,92,0.08)] px-4 py-3">
          <p className="text-sm text-[#4A8B5C]">Email renvoyé avec succès !</p>
        </div>
      )}

      <Button
        variant="secondary"
        size="md"
        disabled={countdown > 0}
        onClick={handleResend}
        className="w-full"
      >
        {countdown > 0 ? `Renvoyer dans ${countdown}s` : 'Renvoyer l\'email'}
      </Button>

      <Button
        variant="ghost"
        size="md"
        onClick={() => router.push('/auth/login')}
        className="w-full"
      >
        Retour à la connexion
      </Button>
    </div>
  )
}
