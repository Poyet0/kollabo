import * as React from 'react'
import { cn, formatFCFA } from '@/lib/utils'

interface MoneyDisplayProps {
  amount: number
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'gold' | 'pearl' | 'muted'
  compact?: boolean
  showSymbol?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-4xl',
}

const variantClasses = {
  gold: 'text-[#C9A84C]',
  pearl: 'text-[#F5F2EA]',
  muted: 'text-[#6B6B6B]',
}

/** Affiche un montant FCFA en police monospace aligné */
export function MoneyDisplay({
  amount,
  size = 'md',
  variant = 'pearl',
  compact = false,
  showSymbol = true,
  className,
}: MoneyDisplayProps) {
  return (
    <span
      className={cn(
        'font-mono font-semibold tabular-nums',
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {formatFCFA(amount, { compact, showSymbol })}
    </span>
  )
}
