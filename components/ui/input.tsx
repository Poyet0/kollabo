import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  error?: string
  label?: string
  hint?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, prefix, suffix, id, ...props }, ref) => {
    const inputId = id ?? React.useId()

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#F5F2EA] leading-none"
          >
            {label}
            {props.required && <span className="text-[#C9A84C] ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {prefix && (
            <div className="absolute left-3 flex items-center text-[#6B6B6B] pointer-events-none">
              {prefix}
            </div>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-[10px] border bg-[#1A1A1A] px-3 py-2',
              'text-sm text-[#F5F2EA] placeholder:text-[#6B6B6B]',
              'border-[#2A2A2A]',
              'transition-colors duration-150',
              'focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/30',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#F5F2EA]',
              error && 'border-[#B84545] focus:border-[#B84545] focus:ring-[#B84545]/30',
              prefix && 'pl-9',
              suffix && 'pr-9',
              className,
            )}
            ref={ref}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            aria-invalid={error ? 'true' : undefined}
            {...props}
          />

          {suffix && (
            <div className="absolute right-3 flex items-center text-[#6B6B6B]">
              {suffix}
            </div>
          )}
        </div>

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-[#6B6B6B]">
            {hint}
          </p>
        )}

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-[#B84545]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
