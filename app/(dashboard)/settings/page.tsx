import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Shield, Bell, CreditCard, Download, Trash2, Lock, User } from 'lucide-react'

export const metadata: Metadata = { title: 'Paramètres' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F5F2EA] font-[family-name:var(--font-display)] tracking-tight">
          Paramètres
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">Gérez votre compte et vos préférences</p>
      </div>

      {/* Profil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="size-4 text-[#C9A84C]" />
            <CardTitle className="text-base">Informations personnelles</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nom complet"
            defaultValue={profile?.full_name ?? ''}
            placeholder="Votre nom"
          />
          <Input
            label="Email"
            type="email"
            defaultValue={user.email ?? ''}
            disabled
            hint="L'email ne peut pas être modifié ici pour des raisons de sécurité."
          />
          <Input
            label="Téléphone"
            type="tel"
            defaultValue={profile?.phone ?? ''}
            placeholder="+225 07 00 00 00"
          />
          <Input
            label="Ville"
            defaultValue={profile?.city ?? ''}
            placeholder="Abidjan"
          />
          <Button variant="primary-gold" size="md">Sauvegarder les modifications</Button>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-[#C9A84C]" />
            <CardTitle className="text-base">Sécurité</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#F5F2EA]">Mot de passe</p>
              <p className="text-xs text-[#6B6B6B]">Dernière modification : jamais</p>
            </div>
            <Button variant="secondary-outline" size="sm">
              <Lock className="size-3.5" /> Modifier
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#F5F2EA]">Authentification à 2 facteurs</p>
              <p className="text-xs text-[#6B6B6B]">Protégez votre compte avec un code SMS</p>
            </div>
            <Button variant="secondary-outline" size="sm">Activer</Button>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium text-[#F5F2EA] mb-2">Sessions actives</p>
            <div className="rounded-[10px] border border-[#2A2A2A] bg-[#1A1A1A]/50 p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#F5F2EA]">Navigateur actuel</p>
                <p className="text-xs text-[#6B6B6B]">Abidjan, CI · Maintenant</p>
              </div>
              <span className="text-xs text-[#4A8B5C] font-medium">Actuelle</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-[#C9A84C]" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Nouvelles candidatures reçues', desc: 'Email + SMS', enabled: true },
            { label: 'Contrat signé', desc: 'Email + SMS', enabled: true },
            { label: 'Paiement reçu / libéré', desc: 'Email + SMS + Push', enabled: true },
            { label: 'Livrable soumis', desc: 'Email', enabled: true },
            { label: 'Nouveau message', desc: 'Push', enabled: false },
          ].map((notif) => (
            <div key={notif.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-[#F5F2EA]">{notif.label}</p>
                <p className="text-xs text-[#6B6B6B]">{notif.desc}</p>
              </div>
              <div
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${notif.enabled ? 'bg-[#C9A84C]' : 'bg-[#2A2A2A]'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${notif.enabled ? 'translate-x-4' : 'translate-x-1'}`} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RGPD */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="size-4 text-[#C9A84C]" />
            <CardTitle className="text-base">Mes données (RGPD / ARTCI)</CardTitle>
          </div>
          <CardDescription>
            Conformément à la loi n° 2013-450 et au RGPD, vous avez le droit d&apos;accéder, rectifier, exporter et supprimer vos données.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="secondary-outline" size="md" className="w-full justify-start gap-2">
            <Download className="size-4" />
            Exporter toutes mes données (JSON)
          </Button>
          <Separator />
          <div className="space-y-1">
            <Button variant="danger-outline" size="md" className="w-full justify-start gap-2">
              <Trash2 className="size-4" />
              Demander la suppression de mon compte
            </Button>
            <p className="text-xs text-[#6B6B6B] px-1">
              Irréversible. Vos données seront supprimées sous 30 jours (sauf obligations légales — 10 ans pour les contrats et factures).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
