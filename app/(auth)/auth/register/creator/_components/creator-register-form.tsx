'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

const schema = z
  .object({
    fullName: z.string().min(2, 'Nom trop court').max(80, 'Nom trop long'),
    email: z.string().email('Email invalide'),
    phone: z
      .string()
      .regex(/^\+?[0-9\s\-]{8,15}$/, 'Numéro invalide (ex: +225 07 00 00 00)')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(10, 'Minimum 10 caractères')
      .regex(/[A-Z]/, 'Au moins une majuscule')
      .regex(/[0-9]/, 'Au moins un chiffre'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export function CreatorRegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    const supabase = createClient()

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          phone: data.phone ?? null,
          user_type: 'creator',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('Un compte existe déjà avec cet email.')
      } else {
        setError('Erreur lors de la création du compte. Réessayez.')
      }
      return
    }

    router.push('/auth/verify-otp?type=email&next=/onboarding/creator')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input
        type="text"
        label="Nom complet"
        placeholder="Ange Kouamé"
        autoComplete="name"
        prefix={<User className="size-4" />}
        error={errors.fullName?.message}
        required
        {...register('fullName')}
      />

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

      <Input
        type="tel"
        label="Téléphone (optionnel)"
        placeholder="+225 07 00 00 00"
        autoComplete="tel"
        prefix={<Phone className="size-4" />}
        hint="Pour les notifications SMS et l'OTP"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        type={showPassword ? 'text' : 'password'}
        label="Mot de passe"
        placeholder="••••••••••"
        autoComplete="new-password"
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
        hint="10 caractères min · 1 majuscule · 1 chiffre"
        error={errors.password?.message}
        required
        {...register('password')}
      />

      <Input
        type={showPassword ? 'text' : 'password'}
        label="Confirmer le mot de passe"
        placeholder="••••••••••"
        autoComplete="new-password"
        prefix={<Lock className="size-4" />}
        error={errors.confirmPassword?.message}
        required
        {...register('confirmPassword')}
      />

      {error && (
        <div className="rounded-[10px] border border-[#B84545]/30 bg-[rgba(184,69,69,0.08)] px-4 py-3">
          <p className="text-sm text-[#B84545]">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        variant="primary-gold"
        size="lg"
        loading={isSubmitting}
        className="w-full mt-1"
      >
        Créer mon compte créateur
      </Button>
    </form>
  )
}
