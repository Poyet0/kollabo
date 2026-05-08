'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})
type LoginData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form

  async function onSubmit(data: LoginData) {
    setError(null)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      if (authError.message.includes('Invalid login credentials')) {
        setError('Email ou mot de passe incorrect.')
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Veuillez vérifier votre email avant de vous connecter.')
      } else {
        setError('Une erreur est survenue. Réessayez.')
      }
      return
    }

    router.push(redirect)
    router.refresh()
  }

  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Google */}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={handleGoogleLogin}
        className="w-full"
      >
        <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continuer avec Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-[#6B6B6B]">ou avec email</span>
        <Separator className="flex-1" />
      </div>

      {/* Email */}
      <Input
        type="email"
        label="Email"
        placeholder="vous@example.com"
        autoComplete="email"
        prefix={<Mail className="size-4" />}
        error={errors.email?.message}
        required
        {...register('email')}
      />

      {/* Mot de passe */}
      <div className="flex flex-col gap-1.5">
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Mot de passe"
          placeholder="••••••••••"
          autoComplete="current-password"
          prefix={<Lock className="size-4" />}
          suffix={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-[#6B6B6B] hover:text-[#F5F2EA] transition-colors"
              aria-label={showPassword ? 'Masquer' : 'Afficher'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
          error={errors.password?.message}
          required
          {...register('password')}
        />
        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-xs text-[#6B6B6B] hover:text-[#C9A84C] transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="rounded-[10px] border border-[#B84545]/30 bg-[rgba(184,69,69,0.08)] px-4 py-3">
          <p className="text-sm text-[#B84545]">{error}</p>
        </div>
      )}

      <Button type="submit" variant="primary-gold" size="lg" loading={isSubmitting} className="w-full mt-1">
        Se connecter
      </Button>
    </form>
  )
}
