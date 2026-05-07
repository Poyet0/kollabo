import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formate un montant en FCFA : 2450000 → "2 450 000 F" */
export function formatFCFA(amount: number, options?: { compact?: boolean; showSymbol?: boolean }): string {
  const { compact = false, showSymbol = true } = options ?? {}

  if (compact && amount >= 1_000_000) {
    const val = (amount / 1_000_000).toFixed(1).replace(/\.0$/, '')
    return showSymbol ? `${val} M F` : `${val} M`
  }

  if (compact && amount >= 1_000) {
    const val = (amount / 1_000).toFixed(0)
    return showSymbol ? `${val} K F` : `${val} K`
  }

  const formatted = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  return showSymbol ? `${formatted} F` : formatted
}

/** Calcule la commission KOLLABO selon les paliers */
export function calculateCommission(amount: number): {
  rate: number
  commissionHT: number
  tvaAmount: number
  commissionTTC: number
  creatorNet: number
} {
  let rate: number
  if (amount < 500_000) {
    rate = 0.15
  } else if (amount <= 2_000_000) {
    rate = 0.12
  } else {
    rate = 0.08
  }

  const commissionHT = Math.round(amount * rate)
  const tvaAmount = Math.round(commissionHT * 0.18) // TVA 18%
  const commissionTTC = commissionHT + tvaAmount
  const creatorNet = amount - commissionHT // La marque paie la TVA en plus

  return { rate, commissionHT, tvaAmount, commissionTTC, creatorNet }
}

/** Calcule la RAS 7.5% (Article 56 CGI ivoirien) */
export function calculateRAS(amount: number): number {
  return Math.round(amount * 0.075)
}

/** Formate un nombre d'abonnés : 35000 → "35K" / 1200000 → "1,2M" */
export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`
  return count.toString()
}

/** Tronque un texte avec ellipse */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

/** Génère les initiales d'un nom : "Ange Kouamé" → "AK" */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Vérifie si une URL est valide */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/** Délai asynchrone */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Noms des méthodes de paiement */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  wave: 'Wave',
  orange_money: 'Orange Money',
  mtn_money: 'MTN MoMo',
  card_cinetpay: 'Carte bancaire',
}

/** Statuts des contrats avec labels FR */
export const CONTRACT_STATUS_LABELS: Record<string, string> = {
  pending_signatures: 'En attente de signatures',
  active: 'Actif',
  in_delivery: 'En livraison',
  completed: 'Terminé',
  disputed: 'En litige',
  cancelled: 'Annulé',
}

/** Statuts des livrables avec labels FR */
export const DELIVERABLE_STATUS_LABELS: Record<string, string> = {
  pending: 'À livrer',
  submitted: 'Soumis',
  approved: 'Approuvé',
  revision_requested: 'Révision demandée',
  rejected: 'Rejeté',
}
