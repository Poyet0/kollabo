'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px]',
    'text-sm font-medium transition-all duration-150',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9A84C]',
    'disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        /* Or solide — CTA principal */
        'primary-gold': [
          'bg-[#C9A84C] text-[#0A0A0A] font-semibold',
          'hover:bg-[#E8C977] hover:-translate-y-px',
          'active:translate-y-0 active:bg-[#8C7330]',
          'shadow-[0_8px_24px_rgba(201,168,76,0.25)]',
          'hover:shadow-[0_12px_32px_rgba(201,168,76,0.35)]',
          'btn-gold-shimmer',
        ],
        /* Outline or */
        'secondary-outline': [
          'border border-[#C9A84C] text-[#C9A84C] bg-transparent',
          'hover:bg-[rgba(201,168,76,0.08)] hover:-translate-y-px',
          'active:translate-y-0',
        ],
        /* Fond surface */
        secondary: [
          'bg-[#2A2A2A] text-[#F5F2EA]',
          'hover:bg-[#3A3A3A] hover:-translate-y-px',
        ],
        /* Fantôme */
        ghost: [
          'text-[#F5F2EA] bg-transparent',
          'hover:bg-[#1A1A1A] hover:text-[#F5F2EA]',
        ],
        /* Danger */
        danger: [
          'bg-[#B84545] text-[#F5F2EA]',
          'hover:bg-[#C95555] hover:-translate-y-px',
        ],
        /* Danger outline */
        'danger-outline': [
          'border border-[#B84545] text-[#B84545] bg-transparent',
          'hover:bg-[rgba(184,69,69,0.08)]',
        ],
        /* Lien */
        link: [
          'text-[#C9A84C] underline-offset-4 hover:underline bg-transparent',
          'h-auto p-0',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'primary-gold',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin size-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
