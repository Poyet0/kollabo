import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-[6px] border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-[#2A2A2A] bg-[#2A2A2A] text-[#F5F2EA]',
        gold: 'border-[#C9A84C]/30 bg-[rgba(201,168,76,0.12)] text-[#C9A84C]',
        'gold-solid': 'border-[#C9A84C] bg-[#C9A84C] text-[#0A0A0A]',
        success: 'border-[#4A8B5C]/30 bg-[rgba(74,139,92,0.12)] text-[#4A8B5C]',
        danger: 'border-[#B84545]/30 bg-[rgba(184,69,69,0.12)] text-[#B84545]',
        warning: 'border-[#D4A437]/30 bg-[rgba(212,164,55,0.12)] text-[#D4A437]',
        info: 'border-[#4A6B8B]/30 bg-[rgba(74,107,139,0.12)] text-[#4A6B8B]',
        outline: 'border-[#6B6B6B] bg-transparent text-[#6B6B6B]',
        smoke: 'border-transparent bg-[#2A2A2A] text-[#6B6B6B]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
