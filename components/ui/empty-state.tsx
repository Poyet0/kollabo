import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-[16px]',
        'border border-dashed border-[#2A2A2A] bg-[#1A1A1A]/50',
        'px-8 py-16 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2A2A2A]">
          <Icon className="size-8 text-[#6B6B6B]" />
        </div>
      )}

      <div className="flex flex-col gap-1.5 max-w-sm">
        <h3 className="text-base font-semibold text-[#F5F2EA] font-[family-name:var(--font-display)]">
          {title}
        </h3>
        {description && <p className="text-sm text-[#6B6B6B] leading-relaxed">{description}</p>}
      </div>

      {action && (
        <Button
          variant="primary-gold"
          size="md"
          onClick={action.onClick}
          asChild={!!action.href}
        >
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      )}
    </div>
  )
}
