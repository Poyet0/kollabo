import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
  variant?: 'default' | 'gold'
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  className,
  variant = 'default',
}: StatCardProps) {
  const isPositive = (change ?? 0) >= 0

  return (
    <div
      className={cn(
        'rounded-[16px] border p-6 transition-all duration-200',
        variant === 'gold'
          ? 'border-[#C9A84C]/30 bg-[rgba(201,168,76,0.06)]'
          : 'border-[#2A2A2A] bg-[#1A1A1A]',
        'hover:border-[#C9A84C]/40 hover:shadow-[0_8px_24px_rgba(201,168,76,0.08)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <p className="text-sm text-[#6B6B6B] font-medium truncate">{label}</p>
          <p
            className={cn(
              'text-2xl font-bold font-[family-name:var(--font-display)] truncate',
              variant === 'gold' ? 'text-[#C9A84C]' : 'text-[#F5F2EA]',
            )}
          >
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              {isPositive ? (
                <TrendingUp className="size-3.5 text-[#4A8B5C]" />
              ) : (
                <TrendingDown className="size-3.5 text-[#B84545]" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  isPositive ? 'text-[#4A8B5C]' : 'text-[#B84545]',
                )}
              >
                {isPositive ? '+' : ''}
                {change}%
              </span>
              {changeLabel && <span className="text-xs text-[#6B6B6B]">{changeLabel}</span>}
            </div>
          )}
        </div>

        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]',
              variant === 'gold' ? 'bg-[rgba(201,168,76,0.15)]' : 'bg-[#2A2A2A]',
            )}
          >
            <Icon
              className={cn('size-5', variant === 'gold' ? 'text-[#C9A84C]' : 'text-[#6B6B6B]')}
            />
          </div>
        )}
      </div>
    </div>
  )
}
